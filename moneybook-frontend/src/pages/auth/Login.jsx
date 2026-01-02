import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../media/logo.png";
import background from "../../media/background.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginApi({
        email: form.email.toLowerCase(),
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", res);

      const token =
        res?.token ||
        res?.accessToken ||
        res?.jwt ||
        res?.data?.token;

      if (!token) {
        throw new Error("Token not found in response");
      }

      login(token);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="absolute left-6 md:left-16 top-1/2 -translate-y-1/2 w-full max-w-md bg-white/95 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <img src={logo} alt="MoneyBook" className="mx-auto h-16 mb-2" />
          <h1 className="text-2xl font-bold">MoneyBook</h1>
          <p className="text-sm text-gray-600">Welcome back</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-3 pr-12 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
