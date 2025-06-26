import { useEffect, useState } from "react";
import { loginClient, registerClient } from "../services/shopService";
import { WarningMessage } from "../components/WarningMessage";

function Verification() {
  const [loginData, setLoginData] = useState<{
    name?: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const [loginPage, setLoginPage] = useState<boolean>(true);
  const [warning, setWarning] = useState<{
    description: string;
    level: string;
  } | null>(null);
  const checkProfile = async () => {
    try {
      if (loginPage) {
        await loginClient(loginData.email, loginData.password);
        setLoginData((prev) => ({ ...prev, password: "" }));
      } else {
        if (loginData.name) {
          await registerClient(
            loginData.name,
            loginData.email,
            loginData.password
          );
          setLoginData({ name: "", email: "", password: "" });
        }
      }
    } catch (err: any) {
      setWarning({
        description: err.message || "Something wrong",
        level: "hard",
      });
    }
  };

  useEffect(() => {
    setLoginData({ name: "", email: "", password: "" });
  }, [loginPage]);

  return (
    <>
      <div className="bg-img">
        <form
        className="verification-form"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            checkProfile();
          }}
        >
          {/* <div className="verification-content"> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
            <h1>{loginPage ? "Login" : "Register"}</h1>

            {loginPage ? null : (
              <div className="form-control">
                <input
                  type="text"
                  name="name"
                  value={loginData.name}
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
                <label htmlFor="name">
                  <span style={{ transitionDelay: "0ms" }}>N</span>
                  <span style={{ transitionDelay: "50ms" }}>a</span>
                  <span style={{ transitionDelay: "100ms" }}>m</span>
                  <span style={{ transitionDelay: "150ms" }}>e</span>
                </label>
              </div>
            )}

            <div className="form-control">
              <input
                type="text"
                name="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
              <label htmlFor="email">
                <span style={{ transitionDelay: "0ms" }}>E</span>
                <span style={{ transitionDelay: "50ms" }}>m</span>
                <span style={{ transitionDelay: "100ms" }}>a</span>
                <span style={{ transitionDelay: "150ms" }}>i</span>
                <span style={{ transitionDelay: "200ms" }}>l</span>
              </label>
            </div>
            <div className="form-control">
              <input
                type="password"
                name="psw"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />

              <label htmlFor="psw">
                <span style={{ transitionDelay: "0ms" }}>P</span>
                <span style={{ transitionDelay: "50ms" }}>a</span>
                <span style={{ transitionDelay: "100ms" }}>s</span>
                <span style={{ transitionDelay: "150ms" }}>s</span>
                <span style={{ transitionDelay: "200ms" }}>w</span>
                <span style={{ transitionDelay: "250ms" }}>o</span>
                <span style={{ transitionDelay: "300ms" }}>r</span>
                <span style={{ transitionDelay: "350ms" }}>d</span>
              </label>
            </div>

            <div className="form-change-form">
              <p>{loginPage ? "Don't have an account yet?" : "Already have a profile?"}</p>
              <button
                type="button"
                onClick={() => {
                  loginPage ? setLoginPage(false) : setLoginPage(true);
                }}
              >
                {loginPage ? "Register" : "Login"}
              </button>

            </div>
           
            <button type="submit" className="btn">
              {loginPage ? "Login" : "Register"}
            </button>
          {/* </div> */}
        </form>
      </div>
      {warning && (
        <WarningMessage
          description={warning.description}
          level={warning.level}
          onClose={() => setWarning(null)}
        />
      )}
    </>
  );
}

export default Verification;
