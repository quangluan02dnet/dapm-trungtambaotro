create database TrungTamBaoTroTreMoCoi
go

use TrungTamBaoTroTreMoCoi
go
CREATE TABLE NGUOINHANNUOI (
  idnguoinhannuoi CHAR(6) PRIMARY KEY,
  hovaten NVARCHAR(50),
  diachi NVARCHAR(50),
  gioitinh CHAR(1),
  SDT CHAR(10),
  email VARCHAR(30),
  matkhau VARCHAR(15),
  ngaySinh DATE
);

CREATE TABLE TRE (
  idTre CHAR(6) PRIMARY KEY,
  hovaten NVARCHAR(50),
  ngaysinh DATE,
  gioitinh CHAR(1),
  ngayNhanNuoi DATE,
  trangthai CHAR(1),
  ghichu NVARCHAR(250),
  idnguoinhannuoi CHAR(6),
  FOREIGN KEY (idnguoinhannuoi) REFERENCES NGUOINHANNUOI(idnguoinhannuoi)
);

CREATE TABLE VAITRO (
  idVaitro INT PRIMARY KEY,
  tenVaitro NVARCHAR(20),
  moTa NVARCHAR(250)
);
CREATE TABLE NHANVIEN (
  idNhanvien CHAR(6) PRIMARY KEY,
  hoVaten NVARCHAR(50),
  diaChi NVARCHAR(50),
  Email VARCHAR(30),
  SDT CHAR(10),
  gioiTinh CHAR(1),
  ngaySinh DATE,
  matkhau VARCHAR(15),
  idVaitro INT,
  FOREIGN KEY (idVaitro) REFERENCES VAITRO(idVaitro)
);


CREATE TABLE HOSONHANNUOI (
  idHoso CHAR(6) PRIMARY KEY,
  ngayguihoso DATETIME NOT NULL,
  yeuCau NVARCHAR(250),
  ChungNhanKetHon VARCHAR(10),
  GiayKhamSucKhoe VARCHAR(10),
  TinhTrangChoo CHAR(1),
  MucThuNhapHangThang float,
  NgheNghiep NVARCHAR(30),
  trangThai CHAR(1),
  idnhanvien CHAR(6),
  idnguoinhannuoi CHAR(6),
  FOREIGN KEY (idnhanvien) REFERENCES NHANVIEN(idNhanvien),
  FOREIGN KEY (idnguoinhannuoi) REFERENCES NGUOINHANNUOI(idnguoinhannuoi)
);
go

CREATE PROCEDURE ThemHoSoNuoi(
  @idHoso CHAR(6),
  @ngayGuiHoSo DATETIME,
  @yeuCau NVARCHAR(250),
  @ChungNhanKetHon VARCHAR(10), 
  @GiayKhamSucKhoe VARCHAR(10), 
  @TinhTrangChoo CHAR(1),
  @MucThuNhapHangThang FLOAT,
  @NgheNghiep NVARCHAR(30),
  @idNhanVien CHAR(6),
  @idNguoiNuoi CHAR(6)
)
AS
BEGIN
  INSERT INTO HOSONHANNUOI (
    idHoso,
    ngayguihoso,
    yeuCau,
    ChungNhanKetHon,
    GiayKhamSucKhoe,
    TinhTrangChoo,
    MucThuNhapHangThang,
    NgheNghiep,
    trangThai,
    idnhanvien,
    idnguoinhannuoi
  )
  VALUES (
    @idHoso,
    @ngayGuiHoSo,
    @yeuCau,
    @ChungNhanKetHon,
    @GiayKhamSucKhoe,
    @TinhTrangChoo,
    @MucThuNhapHangThang,
    @NgheNghiep,
    'C',
    @idNhanVien,
    @idNguoiNuoi
  );
END;
go

CREATE FUNCTION TinhTuoiTre(
  @idTre CHAR(6)
)
RETURNS INT
AS
BEGIN
  DECLARE @ngaySinh DATE;
  SELECT @ngaySinh = ngaySinh FROM TRE WHERE idTre = @idTre;
  RETURN DATEDIFF(YEAR, @ngaySinh, GETDATE());
END;
go

CREATE TRIGGER CapNhatTrangThaiHoSo
ON TRE
FOR INSERT, UPDATE, DELETE
AS
BEGIN
  UPDATE HOSONHANNUOI
  SET trangThai = (
    SELECT CASE WHEN COUNT(*) = 0 THEN 'C' ELSE 'D' END
    FROM TRE
    WHERE idHoso = (SELECT idHoso FROM INSERTED)
  )
  WHERE idHoso = (SELECT idHoso FROM INSERTED);
END;


CREATE TABLE NGUOINHANNUOI (
  idnguoinhannuoi CHAR(6) PRIMARY KEY,
  hovaten NVARCHAR(50),
  diachi NVARCHAR(50),
  gioitinh CHAR(1),
  SDT CHAR(10),
  email VARCHAR(30),
  matkhau VARCHAR(15),
  ngaySinh DATE
);

INSERT INTO NGUOINHANNUOI (idnguoinhannuoi, hovaten, diachi, gioitinh, SDT, email, matkhau, ngaySinh)
VALUES 
('NN001', N'Nguyễn Văn A', N'123 Đường ABC, Hà Nội', 'M', '0123456789', 'vana@gmail.com', 'matkhau1', '1985-01-01'),
('NN002', N'Trần Thị B', N'456 Đường DEF, Đà Nẵng', 'F', '0987654321', 'thib@gmail.com', 'matkhau2', '1990-02-15'),
('NN003', N'Lê Văn C', N'789 Đường GHI, TP.HCM', 'M', '0912345678', 'vanc@gmail.com', 'matkhau3', '1975-07-20'),
('NN004', N'Phạm Thị D', N'321 Đường JKL, Hải Phòng', 'F', '0934567890', 'thid@gmail.com', 'matkhau4', '1982-12-05'),
('NN005', N'Hoàng Văn E', N'654 Đường MNO, Cần Thơ', 'M', '0945678901', 'vane@gmail.com', 'matkhau5', '2000-03-30');

-- Insert roles into the VAITRO table
INSERT INTO VAITRO (idVaitro, tenVaitro, moTa)
VALUES
(1, N'Quản trị viên', N'Người quản lý hệ thống'),
(2, N'Nhân viên', N'Nhân viên thông thường');

-- Insert data into the NHANVIEN table (ensure no conflict with NGUOINHANNUOI)
INSERT INTO NHANVIEN (idNhanvien, hoVaten, diaChi, Email, SDT, gioiTinh, ngaySinh, matkhau, idVaitro)
VALUES 
('NV001', N'Ngô Thị P', N'12 Đường XYZ, Hà Nội', 'thip@gmail.com', '0111222333', 'F', '1988-05-01', 'matkhauNV1', 1),
('NV002', N'Trần Văn Q', N'34 Đường UVW, Đà Nẵng', 'vanq@gmail.com', '0222333444', 'M', '1975-03-15', 'matkhauNV2', 2);

select * from NGUOINHANNUOI 


SELECT DISTINCT hovaten
FROM NGUOINHANNUOI;