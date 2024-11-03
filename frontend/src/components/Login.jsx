import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้เพื่อเปลี่ยนเส้นทาง
import '../App'; // import ไฟล์ CSS สำหรับการจัดสไตล์

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ตัวแปรสำหรับเปลี่ยนหน้า

  const handleSubmit = (e) => {
    e.preventDefault();
    // ตรวจสอบข้อมูลการ login ที่นี่ (เชื่อมต่อกับ API เพื่อส่งข้อมูลไปตรวจสอบ)
    console.log('Email:', email);
    console.log('Password:', password);

    // ถ้าข้อมูลถูกต้อง ให้ไปที่หน้าหลัก (home)
    navigate('/home');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="login-footer">
          <p>Don't have an account? <a href="/signup">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
