import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [logoShifted, setLogoShifted] = useState(false);
  const [step, setStep] = useState("email"); // "email" | "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // message from server
  const [loading, setLoading] = useState(false);

  const [expiresAt, setExpiresAt] = useState(null);
  const [canResendAt, setCanResendAt] = useState(null);
  const [remaining, setRemaining] = useState({ code: "", resend: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/map");
      return;
    }

    const shift = setTimeout(() => setLogoShifted(true), 1500);
    return () => clearTimeout(shift);
  }, [navigate]);
  
  useEffect(() => {
    const shift = setTimeout(() => setLogoShifted(true), 1500);
    return () => clearTimeout(shift);
  }, []);

  // таймеры: сколько осталось до истечения кода и до возможности повторной отправки
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const updateTimeLeft = (target) => {
        if (!target) return "";
        const diff = new Date(target) - now;
        if (diff <= 0) return "00:00";
        const min = Math.floor(diff / 60000);
        const sec = Math.floor((diff % 60000) / 1000)
          .toString()
          .padStart(2, "0");
        return `${min}:${sec}`;
      };

      setRemaining({
        code: updateTimeLeft(expiresAt),
        resend: updateTimeLeft(canResendAt),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, canResendAt]);

  const requestCode = async () => {
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const res = await fetch("https://functions.yandexcloud.net/d4ebn1fn78mo4t6mjepv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("code");
        setInfo(data.message || "");
        setExpiresAt(data.expiresAt);
        setCanResendAt(data.canResendAt);
      } else {
        setError(data.error || "Ошибка отправки кода. Попробуйте позже");
      }
    } catch {
      setError("Сервер недоступен");
    }

    setLoading(false);
  };

  const verifyCode = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://functions.yandexcloud.net/d4engqs69pvlll9h33nb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);
        navigate("/map");
      } else {
        setError(data.error || "Неверный код");
      }
    } catch {
      setError("Ошибка подключения к серверу");
    }

    setLoading(false);
  };

  const resendCode = () => {
    setExpiresAt(null);
    setCanResendAt(null);
    setCode("");
    requestCode();
  };

  return (
    <div style={containerStyle}>
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

      <div style={formStyle(logoShifted)}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#333" }}>
          {step === "email" ? "Введите email" : "Введите код из письма"}
        </h2>

        {step === "email" ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={requestCode}
              disabled={!email || loading}
              style={buttonStyle(email && !loading)}
            >
              {loading ? "Отправка..." : "Продолжить"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="6-значный код"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              style={inputStyle}
            />

            <button
              onClick={verifyCode}
              disabled={code.length !== 6 || loading}
              style={buttonStyle(code.length === 6 && !loading)}
            >
              {loading ? "Проверка..." : "Войти"}
            </button>

            {info && (
              <p style={{ marginTop: "1rem", color: "#333" }}>
                {info}
              </p>
            )}

            {remaining.code && (
              <p style={{ marginTop: "0.5rem", color: "#555" }}>
                Код истекает через: <strong>{remaining.code}</strong>
              </p>
            )}

            <button
              onClick={resendCode}
              disabled={remaining.resend !== "00:00"}
              style={{
                marginTop: "1rem",
                background: "none",
                color: "#2563eb",
                border: "none",
                fontSize: "0.9rem",
                textDecoration: "underline",
                cursor: remaining.resend === "00:00" ? "pointer" : "not-allowed",
                opacity: remaining.resend === "00:00" ? 1 : 0.5,
              }}
            >
              Отправить новый код
            </button>
          </>
        )}

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </div>
    </div>
  );
}

const containerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};

const formStyle = (visible) => ({
  opacity: visible ? 1 : 0,
  transition: "opacity 0.6s ease 0.3s",
  marginTop: visible ? "200px" : "0px",
  width: "80%",
  maxWidth: "320px",
  textAlign: "center",
});

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  border: "1px solid #ccc",
  borderRadius: "0.375rem",
  marginBottom: "1rem",
  fontSize: "1rem",
};

const buttonStyle = (enabled) => ({
  width: "100%",
  backgroundColor: "#2563eb",
  color: "white",
  padding: "0.5rem",
  border: "none",
  borderRadius: "0.375rem",
  fontSize: "1rem",
  opacity: enabled ? 1 : 0.5,
  cursor: enabled ? "pointer" : "not-allowed",
});