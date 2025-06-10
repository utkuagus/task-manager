import React, { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent, FormEvent } from "react";
import { login } from "../api/UserApi";
import { type LoginRequest, type LoginResponse } from "../types/ApiDTO";

interface props {
  setToken: (token: string) => void;
}

const Login: React.FC<props> = ({ setToken }) => {
  const [form, setForm] = useState<LoginRequest>({
    username_or_email: "",
    password: "",
  });

  const [user, setUser] = useState<LoginResponse>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    console.log("User: ", user);
    setToken(user.tokens.access);
    localStorage.setItem("access", user.tokens.access);
    localStorage.setItem("refresh", user.tokens.refresh);
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("submit entered");
    setError("");
    setLoading(true);

    if (!form.username_or_email || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    // TODO: handle login logic
    console.log("Logging in with:", form);
    try {
      const resp = await login(form);
      setUser(resp);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form flex column" onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>
          <div>Email /</div> <div>Username</div>
        </label>
        <input
          type="text"
          name="username_or_email"
          value={form.username_or_email}
          onChange={handleChange}
          placeholder="Enter your email or username"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;
