import React from 'react';
import './Content.css';
const Content = () => {
    return (
        <div className="container">
            <div className="img">
                <img src="./images/image2.png" alt="Sample Image" />
            </div>

            <div className="content-section">
                <div className="left-section">
                    <h2>TRUNG TÂM BẢO TRỢ XÃ HỘI TRẠI TRẺ MỒ CÔI <br/> TP ĐÀ NẴNG</h2>
                    <p>
                        Trung tâm Bảo trợ trẻ em đường phố Đà Nẵng là một tổ chức xã hội ngoài công lập
                        được thành lập từ năm 1991, ngoài việc thực hiện tốt chức năng, nhiệm vụ của mình
                        thì trong nhiều năm qua công tác môitrường xanh – sạch – đẹp luôn được lãnh đạo,
                        cán bộ và người lao động ở trung tâm quan tâm thực hiện với nhiều hoạt động thiết thực…
                    </p>
                    <p>Địa điểm: Liên Chiểu, TP Đà Nẵng.</p>
                </div>

                <div class="divider"></div> 

                <div className="right-section">
                    <div className="info-box">
                        <h3>Các thông tin cần có trong hồ sơ nhận nuôi</h3>
                        <p>
                            Hồ sơ của người nhận con nuôi trong nước được lập thành 01 bộ, gồm các giấy tờ quy định tại
                            Điều 17 của Luật Nuôi con nuôi. Trường hợp người nhận con nuôi và người được nhận làm con nuôi
                            không thuộc diện ... <a href="#">xem thêm </a>
                        </p>
                    </div>
                    <div className="info-box">
                        <h3>Lưu ý khi làm thủ tục nhận nuôi tại trung tâm</h3>
                        <p>
                            Hồ sơ của người nhận con nuôi trong nước được lập thành 01 bộ, gồm các giấy tờ quy định tại
                            Điều 17 của Luật Nuôi con nuôi. Trường hợp người nhận con nuôi và người được nhận làm con nuôi
                            không thuộc diện ... <a href="#">xem thêm </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        
    );
};

export default Content;
