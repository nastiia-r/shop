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
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            checkProfile();
          }}
        >
          <div className="container">
            <h1>{loginPage ? "Login" : "Register"}</h1>

            {loginPage ? null : (
              <div>
                <label htmlFor="name">
                  <b>Name</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={loginData.name}
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            )}

            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, email: e.target.value }))
              }
            />

            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              value={loginData.password}
              onChange={(e) =>
                setLoginData((prev) => ({ ...prev, password: e.target.value }))
              }
            />

            <button
              type="button"
              onClick={() => {
                loginPage ? setLoginPage(false) : setLoginPage(true);
              }}
            >
              {loginPage ? "Already have a profile?" : "Not registered yet?"}
            </button>
            <button type="submit" className="btn">
              {loginPage ? "Login" : "Register"}
            </button>
          </div>
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
