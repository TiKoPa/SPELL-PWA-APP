import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [logoShifted, setLogoShifted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const shiftLogo = setTimeout(() => setLogoShifted(true), 1500);
    return () => clearTimeout(shiftLogo);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("email", email);
    navigate("/map");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Логотип */}
      <img
        src="https://tikopa.ru/spell/assets/spell-logo.png"
        alt="SPELL Logo"
        style={{
          width: "70vw",
          maxWidth: "280px",
          height: "auto",
          position: "absolute",
          top: logoShifted ? "15%" : "50%",
          left: "50%",
          transform: logoShifted
            ? "translateX(-50%) scale(0.85)"
            : "translate(-50%, -50%) scale(1)",
          transition: "top 0.6s ease, transform 0.6s ease",
        }}
      />

      {/* Форма */}
      <div
        style={{
          opacity: logoShifted ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
          marginTop: logoShifted ? "200px" : "0px",
          width: "80%",
          maxWidth: "320px",
          textAlign: "center",
        }}
      >
        <h2
          style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#333" }}
        >
          Введите email
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ccc",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
            fontSize: "1rem",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={!email}
          style={{
            width: "100%",
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.5rem",
            border: "none",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            opacity: email ? 1 : 0.5,
            cursor: email ? "pointer" : "not-allowed",
          }}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
