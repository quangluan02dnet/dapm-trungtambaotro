const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const multer = require('multer');
const port = process.env.PORT || 5000;
const moment = require('moment');
const path = require('path');
const fs = require('fs');

const app = express();


const dbConfig = {
  server: "LEQUANGLUAN\\LQL",
  database: "TrungTamBaoTroTreMoCoi",
  driver: 'msnodesqlv8',
  options: {
    trustConnection: true,
  },
  user: 'sa',
  password: '123456'
};
async function testConnection() {
  try {
    await sql.connect(dbConfig);
    console.log('Connected successfully');
    sql.close();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();
app.use(cors());
app.use(bodyParser.json());


app.post('/login', async (req, res) => {
  try {
    const { SDT, password } = req.body;
    await sql.connect(dbConfig);

    const adminResult = await sql.query`SELECT * FROM NHANVIEN WHERE SDT = ${SDT} AND matkhau = ${password}`;
    if (adminResult.recordset.length > 0) {
      const adminInfo = adminResult.recordset[0];
      sql.close();

          // Determine the role of the employee
      let role = 'admin';
      if (adminInfo.idVaitro === 3) {
        role = 'Nhân viên kiểm định';
      }
      if (adminInfo.idVaitro === 2) {
        role = 'Nhân viên phòng bảo trợ';
      }

      res.status(200).json({ message: 'Login successful', user: { ...adminInfo, hovaten: adminInfo.hoVaten, role } });
      return;
    }

    const userResult = await sql.query`SELECT * FROM NGUOINHANNUOI WHERE SDT = ${SDT} AND matkhau = ${password}`;
    sql.close();
    if (userResult.recordset.length > 0) {
      const userInfo = userResult.recordset[0];
      res.status(200).json({ message: 'Login successful', user: { ...userInfo, hovaten: userInfo.hovaten, role: 'user', CCCD: userInfo.CCCD } });
    } else {
      res.status(401).json({ message: 'Invalid phone number or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/register', async (req, res) => {
  try {
    const { fullName, address, gender, phone, email, password, dob, cccd } = req.body;
    const formattedDob = new Date(dob);

    await sql.connect(dbConfig);

    const checkExistQuery = `SELECT COUNT(*) AS count FROM NGUOINHANNUOI WHERE CCCD = @cccd`;
    const checkExistRequest = new sql.Request();
    checkExistRequest.input('cccd', sql.Char, cccd);
    const existResult = await checkExistRequest.query(checkExistQuery);
    const exists = existResult.recordset[0].count > 0;
    if (exists) {
      sql.close();
      return res.status(400).json({ message: 'CCCD đã tồn tại trong hệ thống.' });
    }

    const query = `
      INSERT INTO NGUOINHANNUOI (hovaten, diachi, gioitinh, SDT, email, matkhau, ngaySinh, CCCD)
      VALUES (@fullName, @address, @gender, @phone, @email, @password, @dob, @cccd)
    `;

    const request = new sql.Request();
    request.input('fullName', sql.NVarChar, fullName);
    request.input('address', sql.NVarChar, address);
    request.input('gender', sql.Char, gender);
    request.input('phone', sql.VarChar, phone);
    request.input('dob', sql.Date, formattedDob);
    request.input('email', sql.VarChar, email);
    request.input('password', sql.VarChar, password);
    request.input('cccd', sql.VarChar, cccd);

    await request.query(query);
    sql.close();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/profile', async (req, res) => {
  try {
    const { SDT } = req.body;
    await sql.connect(dbConfig);

    const userResult = await sql.query`SELECT * FROM NGUOINHANNUOI WHERE SDT = ${SDT}`;
    sql.close();
    if (userResult.recordset.length > 0) {
      const userInfo = userResult.recordset[0];
      res.status(200).json({ user: userInfo });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.post('/update-profile', async (req, res) => {
  try {
    const { hovaten, diachi, gioitinh, ngaySinh, SDT, email, initialSDT } = req.body;
    await sql.connect(dbConfig);

    const query = `
      UPDATE NGUOINHANNUOI
      SET hovaten = @hovaten, diachi = @diachi, gioitinh = @gioitinh, ngaySinh = @ngaySinh, email = @email, SDT = @SDT
      WHERE SDT = @initialSDT
    `;

    const request = new sql.Request();
    request.input('hovaten', sql.NVarChar, hovaten);
    request.input('diachi', sql.NVarChar, diachi);
    request.input('gioitinh', sql.Char, gioitinh);
    request.input('ngaySinh', sql.Date, new Date(ngaySinh));
    request.input('SDT', sql.VarChar, SDT);
    request.input('email', sql.VarChar, email);
    request.input('initialSDT', sql.VarChar, initialSDT);

    await request.query(query);
    sql.close();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/employees', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM NHANVIEN`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).send('Server error');
  }
});

// Function to generate new ID
const generateNewId = async () => {
  await sql.connect(dbConfig);
  const result = await sql.query`SELECT MAX(idNhanvien) as maxId FROM NHANVIEN`;
  const maxId = result.recordset[0].maxId;
  if (!maxId) {
    return 'NV0001';
  }
  const newIdNum = parseInt(maxId.replace('NV', ''), 10) + 1;
  return `NV${newIdNum.toString().padStart(4, '0')}`;
};

// Endpoint to add employee
app.post('/add-employee', async (req, res) => {
  const { hovaten, ngaySinh, vaitro, diachi, email, sdt, gioitinh, matkhau } = req.body;

  const formattedNgaySinh = `${ngaySinh.year}-${ngaySinh.month}-${ngaySinh.day}`;
  const gender = gioitinh === 'Nam' ? 'M' : 'N';

  try {
    const idNhanvien = await generateNewId();
    await sql.connect(dbConfig);
    await sql.query`INSERT INTO NHANVIEN (idNhanvien, hoVaten, diaChi, Email, SDT, gioiTinh, ngaySinh, matkhau, idVaitro)
                    VALUES (${idNhanvien}, ${hovaten}, ${diachi}, ${email}, ${sdt}, ${gender}, ${formattedNgaySinh}, ${matkhau}, ${vaitro})`;
    res.status(200).send('Employee added successfully');
  } catch (err) {
    console.error('Database insert failed:', err);
    res.status(500).send('Server error');
  }
});
// Add this route to handle fetching an employee by ID
app.get('/employees/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM NHANVIEN WHERE idNhanvien = ${id}`;
    sql.close();
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).send('Server error');
  }
});


// Add this route to handle updating an employee by ID
app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { hoVaten, ngaySinh, diaChi, Email, SDT, gioiTinh, matkhau, idVaitro } = req.body;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      UPDATE NHANVIEN
      SET hoVaten = ${hoVaten}, ngaySinh = ${ngaySinh}, diaChi = ${diaChi}, 
          Email = ${Email}, SDT = ${SDT}, gioiTinh = ${gioiTinh}, 
          matkhau = ${matkhau}, idVaitro = ${idVaitro}
      WHERE idNhanvien = ${id}
    `;
    sql.close();

    if (result.rowsAffected[0] > 0) {
      res.send('Employee updated successfully');
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.error('Database update failed:', err);
    res.status(500).send('Server error');
  }
});

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      DELETE FROM NHANVIEN WHERE idNhanvien = ${id}
    `;
    sql.close();

    if (result.rowsAffected[0] > 0) {
      res.send('Employee deleted successfully');
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (err) {
    console.error('Database delete failed:', err);
    res.status(500).send('Server error');
  }
});
// Function to generate new ID for TRE table
const generateNewTreId = async () => {
  await sql.connect(dbConfig);
  const result = await sql.query`SELECT MAX(idTre) as maxId FROM TRE`;
  const maxId = result.recordset[0].maxId;
  if (!maxId) {
    return 'TRE001';
  }
  const newIdNum = parseInt(maxId.replace('TRE', ''), 10) + 1;
  return `TRE${newIdNum.toString().padStart(3, '0')}`;
};
// Endpoint to add a new child
app.post('/add-child', async (req, res) => {
  const { hovaten, ngaySinh, gioitinh, ngayNhanNuoi, trangthai, ghichu } = req.body;

  try {
    const newId = await generateNewTreId();

    const query = `
      INSERT INTO TRE (idTre, hovaten, ngaysinh, gioitinh, ngayNhanNuoi, trangthai, ghichu)
      VALUES (@idTre, @hovaten, @ngaysinh, @gioitinh, @ngayNhanNuoi, @trangthai, @ghichu)
    `;

    await sql.connect(dbConfig);
    const request = new sql.Request();
    request.input('idTre', sql.Char(6), newId);
    request.input('hovaten', sql.NVarChar(50), hovaten);
   // Check if ngaySinh is provided, if not, pass null
    if (ngaySinh) {
      request.input('ngaysinh', sql.Date, new Date(ngaySinh));
    } else {
      request.input('ngaysinh', sql.Date, null);
    }
    request.input('gioitinh', sql.Char(1), gioitinh);
    request.input('ngayNhanNuoi', sql.Date, new Date(ngayNhanNuoi));
    request.input('trangthai', sql.Char(1), trangthai);
    request.input('ghichu', sql.NVarChar(250), ghichu);

    await request.query(query);

    res.status(200).send({ message: 'Thêm trẻ thành công!' });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).send({ message: 'Đã xảy ra lỗi khi thêm trẻ.' });
  }
});


app.get('/children', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM TRE`;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    res.status(500).send('Failed to fetch data');
  }
});

app.get('/children/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM TRE WHERE idTre = ${id}`;
    sql.close();
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Child not found' });
    }
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

app.put('/children/:id', async (req, res) => {
  const { id } = req.params;
  const { hovaten, ngaySinh, gioitinh, ngayNhanNuoi, trangthai, ghichu } = req.body;
  try {
    await sql.connect(dbConfig);
    const query = `
      UPDATE TRE
      SET hovaten = @hovaten, ngaysinh = @ngaySinh, gioitinh = @gioitinh, ngayNhanNuoi = @ngayNhanNuoi, trangthai = @trangthai, ghichu = @ghichu
      WHERE idTre = @id
    `;
    const request = new sql.Request();
    request.input('hovaten', sql.NVarChar, hovaten);
    request.input('ngaysinh', sql.Date, new Date(ngaySinh));
    request.input('gioitinh', sql.Char, gioitinh);
    request.input('ngayNhanNuoi', sql.Date, new Date(ngayNhanNuoi));
    request.input('trangthai', sql.Int, trangthai);
    request.input('ghichu', sql.NVarChar, ghichu);
    request.input('id', sql.VarChar, id);
    await request.query(query);
    sql.close();
    res.send('Child updated successfully');
  } catch (err) {
    console.error('Database update failed:', err);
    res.status(500).send('Server error');
  }
});


app.delete('/children/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      DELETE FROM TRE WHERE idTre = ${id}
    `;
    sql.close();
    if (result.rowsAffected[0] > 0) {
      res.send('Child deleted successfully');
    } else {
      res.status(404).send('Child not found');
    }
  } catch (err) {
    console.error('Database delete failed:', err);
    res.status(500).send('Server error');
  }
});

// Set up file storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({  storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Function to get the next idHoso
const getNextIdHoso = async () => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('SELECT MAX(idHoso) as lastId FROM HOSONHANNUOI');
    let lastId = result.recordset[0].lastId;
    if (!lastId) return 'HS0001';

    let idNumber = parseInt(lastId.slice(2)) + 1;
    return `HS${idNumber.toString().padStart(4, '0')}`;
  } catch (err) {
    throw new Error('Error fetching last idHoso');
  }
};


app.post('/submit-profile', upload.fields([
  { name: 'chungNhanKetHon', maxCount: 1 },
  { name: 'giayKhamSucKhoe', maxCount: 1 }
]), async (req, res) => {
  const { yeuCau, TinhTrangChoo, MucThuNhapHangThang, NgheNghiep, trangThai, idnhanvien, idTre, CCCD } = req.body;
  const chungNhanKetHonPath = req.files.chungNhanKetHon ? req.files.chungNhanKetHon[0].path : null;
  const giayKhamSucKhoePath = req.files.giayKhamSucKhoe ? req.files.giayKhamSucKhoe[0].path : null;
  const ngayguihoso = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    const idHoso = await getNextIdHoso();

    let pool = await sql.connect(dbConfig);
    await pool.request()
      .input('idHoso', sql.Char(6), idHoso)
      .input('ngayguihoso', sql.DateTime, ngayguihoso)
      .input('yeuCau', sql.NVarChar(250), yeuCau)
      .input('ChungNhanKetHon', sql.NVarChar(255), chungNhanKetHonPath)
      .input('GiayKhamSucKhoe', sql.NVarChar(255), giayKhamSucKhoePath)
      .input('TinhTrangChoo', sql.Char(1), TinhTrangChoo)
      .input('MucThuNhapHangThang', sql.Float, MucThuNhapHangThang)
      .input('NgheNghiep', sql.NVarChar(30), NgheNghiep)
      .input('trangThai', sql.Char(1), trangThai)
      .input('idnhanvien', sql.Char(6), idnhanvien)
      .input('idTre', sql.Char(6), idTre)
      .input('CCCD', sql.Char(12), CCCD)
      .query(`
        INSERT INTO HOSONHANNUOI (idHoso, ngayguihoso, yeuCau, ChungNhanKetHon, GiayKhamSucKhoe, TinhTrangChoo, MucThuNhapHangThang, NgheNghiep, trangThai, idnhanvien, idTre, CCCD)
        VALUES (@idHoso, @ngayguihoso, @yeuCau, @ChungNhanKetHon, @GiayKhamSucKhoe, @TinhTrangChoo, @MucThuNhapHangThang, @NgheNghiep, @trangThai, @idnhanvien, @idTre, @CCCD)
      `);

    res.status(200).send('Profile submitted successfully');
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error submitting profile');
  }
});

app.get('/adoption-profiles', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`SELECT * FROM HOSONHANNUOI`;

    const profiles = result.recordset.map(profile => ({
      ...profile,
      ChungNhanKetHon: profile.ChungNhanKetHon ? profile.ChungNhanKetHon.toString('base64') : null,
      GiayKhamSucKhoe: profile.GiayKhamSucKhoe ? profile.GiayKhamSucKhoe.toString('base64') : null
    }));

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching adoption profiles:', error);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get adoption profiles by CCCD
app.get('/get-adoption-profiles/:cccd', async (req, res) => {
  const { cccd } = req.params;
  console.log(`Fetching profiles for CCCD: ${cccd}`);

  try {
    // Connect to the database
    const pool = await sql.connect(dbConfig);
    // Execute the query
    const result = await pool.request()
      .input('cccd', sql.Char(12), cccd)
      .query('SELECT * FROM HOSONHANNUOI WHERE CCCD = @cccd');
    
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: 'Error fetching profiles' });
  }
});


app.get('/adoption-profiles/:idHoso', async (req, res) => {
  const { idHoso } = req.params;
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request()
      .input('idHoso', sql.Char(6), idHoso)
      .query('SELECT * FROM HOSONHANNUOI WHERE idHoso = @idHoso');
    res.status(200).send(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).send({ message: 'Error fetching profile data' });
  }
});

// Update profile route
app.post('/update-profile/:idHoso', upload.fields([{ name: 'chungNhanKetHon' }, { name: 'giayKhamSucKhoe' }]), async (req, res) => {
  const { idHoso } = req.params;
  const { yeuCau, mucThuNhapHangThang, tinhTrangChoO, ngheNghiep, trangThai, nhanVienKiemDuyet } = req.body;

  const chungNhanKetHonPath = req.files.chungNhanKetHon ? req.files.chungNhanKetHon[0].path : null;
  const giayKhamSucKhoePath = req.files.giayKhamSucKhoe ? req.files.giayKhamSucKhoe[0].path : null;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('hoTen', sql.NVarChar, nhanVienKiemDuyet)
      .query('SELECT idNhanvien FROM NHANVIEN WHERE hoVaten = @hoTen');
    
    const idNhanvien = result.recordset[0]?.idNhanvien;
    if (!idNhanvien) {
      return res.status(400).send({ message: 'Nhân viên kiểm định không tồn tại' });
    }
    
    await pool.request()
      .input('idHoso', sql.Char(6), idHoso)
      .input('yeuCau', sql.NVarChar, yeuCau)
      .input('mucThuNhapHangThang', sql.Float, mucThuNhapHangThang)
      .input('tinhTrangChoO', sql.Char(1), tinhTrangChoO)
      .input('ngheNghiep', sql.NVarChar, ngheNghiep)
      .input('trangThai', sql.Char(1), trangThai)
      .input('idNhanvien', sql.Char(6), idNhanvien)
      .input('chungNhanKetHon', sql.NVarChar, chungNhanKetHonPath)
      .input('giayKhamSucKhoe', sql.NVarChar, giayKhamSucKhoePath)
      .query(`
        UPDATE HOSONHANNUOI SET
          yeuCau = @yeuCau,
          MucThuNhapHangThang = @mucThuNhapHangThang,
          TinhTrangChoO = @tinhTrangChoO,
          NgheNghiep = @ngheNghiep,
          trangThai = @trangThai,
          idNhanvien = @idNhanvien,
          ChungNhanKetHon = COALESCE(@chungNhanKetHon, ChungNhanKetHon),
          GiayKhamSucKhoe = COALESCE(@giayKhamSucKhoe, GiayKhamSucKhoe)
        WHERE idHoso = @idHoso
      `);

    res.status(200).send({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ message: 'Failed to update profile' });
  }
});
// Delete profile route
app.delete('/xoahoso/:idHoso', async (req, res) => {
  const { idHoso } = req.params;
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('idHoso', sql.Char(6), idHoso)
      .query('DELETE FROM HOSONHANNUOI WHERE idHoso = @idHoso');
    res.status(200).send({ message: 'Profile deleted successfully!' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).send({ message: 'Failed to delete profile' });
  }
});


// Endpoint to get user info by CCCD
app.get('/user-info/:cccd', async (req, res) => {
  const { cccd } = req.params;
  const query = `SELECT hovaten, gioitinh, ngaySinh FROM NGUOINHANNUOI WHERE CCCD = @cccd`;

  
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('cccd', sql.VarChar(12), cccd)
      .query(query);

    if (result.recordset.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).send('Error fetching user info');
  }
});

app.post('/update-profile-admin/:idHoso', upload.fields([{ name: 'chungNhanKetHon' }, { name: 'giayKhamSucKhoe' }]), async (req, res) => {
  const { idHoso } = req.params;
  const { yeuCau, mucThuNhapHangThang, tinhTrangChoO, ngheNghiep, trangThai } = req.body;

  let chungNhanKetHonPath = req.files.chungNhanKetHon ? req.files.chungNhanKetHon[0].path : null;
  let giayKhamSucKhoePath = req.files.giayKhamSucKhoe ? req.files.giayKhamSucKhoe[0].path : null;

  try {
    const pool = await sql.connect(dbConfig);
  
    
    await pool.request()
     .input('idHoso', sql.Char(6), idHoso)
      .input('yeuCau', sql.NVarChar, yeuCau)
      .input('mucThuNhapHangThang', sql.NVarChar, mucThuNhapHangThang)
      .input('tinhTrangChoO', sql.Char(1), tinhTrangChoO)
      .input('ngheNghiep', sql.NVarChar, ngheNghiep)
      .input('trangThai', sql.Char(1), trangThai)
      .input('chungNhanKetHon', sql.NVarChar, chungNhanKetHonPath)
      .input('giayKhamSucKhoe', sql.NVarChar, giayKhamSucKhoePath)
      .query(`
        UPDATE HOSONHANNUOI SET
          yeuCau = @yeuCau,
          MucThuNhapHangThang = @mucThuNhapHangThang,
          TinhTrangChoO = @tinhTrangChoO,
          NgheNghiep = @ngheNghiep, trangThai = @trangThai,
          ChungNhanKetHon = COALESCE(@chungNhanKetHon, ChungNhanKetHon),
          GiayKhamSucKhoe = COALESCE(@giayKhamSucKhoe, GiayKhamSucKhoe)
         
        WHERE idHoso = @idHoso
      `);
    res.status(200).send({ message: 'Profile updated successfully!' });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ message: 'Failed to update profile' });
  }
});

app.post('/update-profile-user/:idHoso', upload.fields([{ name: 'chungNhanKetHon' }, { name: 'giayKhamSucKhoe' }]), async (req, res) => {
  const { idHoso } = req.params;
  const { yeuCau, mucThuNhapHangThang, tinhTrangChoO, ngheNghiep, trangThai } = req.body;

  let chungNhanKetHonPath = req.files.chungNhanKetHon ? req.files.chungNhanKetHon[0].path : null;
  let giayKhamSucKhoePath = req.files.giayKhamSucKhoe ? req.files.giayKhamSucKhoe[0].path : null;

  try {
    const pool = await sql.connect(dbConfig);
  
    
    await pool.request()
     .input('idHoso', sql.Char(6), idHoso)
      .input('yeuCau', sql.NVarChar, yeuCau)
      .input('mucThuNhapHangThang', sql.NVarChar, mucThuNhapHangThang)
      .input('tinhTrangChoO', sql.Char(1), tinhTrangChoO)
      .input('ngheNghiep', sql.NVarChar, ngheNghiep)
      .input('trangThai', sql.Char(1), trangThai)
      .input('chungNhanKetHon', sql.NVarChar, chungNhanKetHonPath)
      .input('giayKhamSucKhoe', sql.NVarChar, giayKhamSucKhoePath)
      .query(`
        UPDATE HOSONHANNUOI SET
          yeuCau = @yeuCau,
          MucThuNhapHangThang = @mucThuNhapHangThang,
          TinhTrangChoO = @tinhTrangChoO,
          NgheNghiep = @ngheNghiep, trangThai = @trangThai,
          ChungNhanKetHon = COALESCE(@chungNhanKetHon, ChungNhanKetHon),
          GiayKhamSucKhoe = COALESCE(@giayKhamSucKhoe, GiayKhamSucKhoe)
         
        WHERE idHoso = @idHoso
      `);
    res.status(200).send({ message: 'Profile updated successfully!' });
    
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ message: 'Failed to update profile' });
  }
});

app.put('/adoption-profiles/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(dbConfig);
    await sql.query`UPDATE HOSONHANNUOI SET trangThai = '1' WHERE idHoso = ${id}`;
    sql.close();
    res.status(200).json({ message: 'Profile reviewed successfully.' });
  } catch (error) {
    console.error('Error reviewing profile:', error);
    res.status(500).send('Server error');
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
