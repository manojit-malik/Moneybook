import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../../api/auth.api";
import logo from "../../media/logo.png";
import background from "../../media/background.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  /* ---------- EMAIL VALIDATION ---------- */
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isEmailValid = emailRegex.test(form.email);

  /* ---------- PASSWORD RULES ---------- */
  const passwordRules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const isPasswordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.number &&
    passwordRules.special;

  const passwordsMismatch =
    form.password &&
    form.confirmPassword &&
    form.password !== form.confirmPassword;

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEmailValid)
      return setError("Enter a valid email address");
    if (!isPasswordValid)
      return setError("Password does not meet requirements");
    if (passwordsMismatch)
      return setError("Passwords do not match");

    setLoading(true);
    setError("");

    try {
      await registerApi({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.toLowerCase(),
        password: form.password,
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 w-full max-w-md bg-white/95 p-6 rounded-2xl shadow-2xl">
        <div className="text-center mb-3">
          <img src={logo} alt="MoneyBook" className="mx-auto h-14 mb-1" />
          <h1 className="text-xl font-bold">MoneyBook</h1>
          <p className="text-sm text-gray-600">Create your account</p>
        </div>

        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" hidden />
          <input type="password" hidden />

          <input
            type="text"
            placeholder="First Name"
            required
            value={form.firstName}
            onChange={(e) =>
              setForm({ ...form, firstName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          <input
            type="text"
            placeholder="Last Name"
            required
            value={form.lastName}
            onChange={(e) =>
              setForm({ ...form, lastName: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg text-sm ${
              form.email && !isEmailValid ? "border-red-500" : ""
            }`}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-3 py-2 pr-10 border rounded-lg text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* PASSWORD RULE INDICATORS */}
          <ul className="text-[11px] leading-tight space-y-0.5">
            <li className={passwordRules.length ? "text-green-600" : "text-gray-500"}>
              • Minimum 8 characters
            </li>
            <li className={passwordRules.uppercase ? "text-green-600" : "text-gray-500"}>
              • One uppercase letter
            </li>
            <li className={passwordRules.number ? "text-green-600" : "text-gray-500"}>
              • One number
            </li>
            <li className={passwordRules.special ? "text-green-600" : "text-gray-500"}>
              • One special character
            </li>
          </ul>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm ${
                passwordsMismatch ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !isEmailValid ||
              !isPasswordValid ||
              passwordsMismatch
            }
            className={`w-full text-white font-semibold py-2 rounded-lg text-sm ${
              loading ||
              !isEmailValid ||
              !isPasswordValid ||
              passwordsMismatch
                ? "bg-gray-400"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
