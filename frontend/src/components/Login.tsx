import React, { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent, FormEvent } from "react";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string>("");
  const [isSubmitTriggered, setIsSubmitTriggered] = useState<Boolean>(false);

  useEffect(() => {}, [isSubmitTriggered]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("submit entered");
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    // TODO: handle login logic
    console.log("Logging in with:", form);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
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

      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
