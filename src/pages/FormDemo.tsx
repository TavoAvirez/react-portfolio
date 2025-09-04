import { useState } from "react";
import '../styles/FormDemo.css';

type FormState = {
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  birthdate: string;
  age: number | '';
  experience: number; // 0-10 years
  country: string;
  bio: string;
  agree: boolean;
  newsletter: boolean;
};

export default function FormDemo() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    role: "",
    gender: "",
    birthdate: "",
    age: "",
    experience: 0,
    country: "MX",
    bio: "",
    agree: false,
    newsletter: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    const value = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : type === "number"
      ? Number((e.target as HTMLInputElement).value)
      : (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";

    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!form.role) newErrors.role = "Role is required";

    if (!form.gender) newErrors.gender = "Gender is required";

    if (!form.birthdate) newErrors.birthdate = "Birthdate is required";

    if (form.age === '' || Number(form.age) <= 0) newErrors.age = "Please enter your age";

    if (!form.agree) newErrors.agree = "You must accept the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Simula submit
    alert(`Registro ok para ${form.name} ✅`);
    console.log("Formulario enviado:", form);

    // Reset
    setForm({
      name: "",
      email: "",
      password: "",
      role: "",
      gender: "",
      birthdate: "",
      age: "",
      experience: 0,
      country: "MX",
      bio: "",
      agree: false,
      newsletter: true,
    });
    setErrors({});
  };

  const invalid = (key: string) => Boolean(errors[key]);

  return (
    <div className="container form-container my-4">
      <h2 className="mb-3">Registration Form</h2>
      <p className="">
        This is a dynamic registration form example. Please fill in all required fields marked below. The form includes different input types such as text, email, password, selects, radio buttons, checkboxes, and more.
      </p>

      <div className="card shadow-sm">
        <div className="card-header">Account data</div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* Nombre */}
            <div className="mb-3">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                id="name"
                className={`form-control ${invalid('name') ? 'is-invalid' : ''}`}
                type="text"
                name="name"
                value={form.name}
                onChange={onInputChange}
                placeholder="Your full name"
              />
              {invalid('name') && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                className={`form-control ${invalid('email') ? 'is-invalid' : ''}`}
                type="email"
                name="email"
                value={form.email}
                onChange={onInputChange}
                placeholder="correo@ejemplo.com"
              />
              {invalid('email') && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className={`form-control ${invalid('password') ? 'is-invalid' : ''}`}
                type="password"
                name="password"
                value={form.password}
                onChange={onInputChange}
                placeholder="At least 6 characters"
              />
              {invalid('password') && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            {/* Rol (select) */}
            <div className="mb-3">
              <label className="form-label" htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                className={`form-select ${invalid('role') ? 'is-invalid' : ''}`}
                value={form.role}
                onChange={onInputChange}
              >
                <option value="">Select your role</option>
                <option value="frontend">Frontend Developer</option>
                <option value="backend">Backend Developer</option>
                <option value="fullstack">Fullstack Developer</option>
                <option value="mobile">Mobile Developer</option>
              </select>
              {invalid('role') && <div className="invalid-feedback">{errors.role}</div>}
            </div>

            {/* Género (radio) */}
            <div className="mb-3">
              <span className="form-label">Gender</span>
              <div className={`mt-1 ${invalid('gender') ? 'is-invalid' : ''}`}>
                <label className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="male"
                    checked={form.gender === 'male'}
                    onChange={onInputChange}
                  />
                  Male
                </label>
                <label className="form-check me-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.gender === 'female'}
                    onChange={onInputChange}
                  />
                  Female
                </label>
                <label className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value="other"
                    checked={form.gender === 'other'}
                    onChange={onInputChange}
                  />
                  Prefer not to say
                </label>
              </div>
              {invalid('gender') && <div className="invalid-feedback">{errors.gender}</div>}
            </div>

            {/* Fecha de nacimiento (date) */}
            <div className="mb-3">
              <label className="form-label" htmlFor="birthdate">Birthdate</label>
              <input
                id="birthdate"
                className={`form-control ${invalid('birthdate') ? 'is-invalid' : ''}`}
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={onInputChange}
              />
              {invalid('birthdate') && <div className="invalid-feedback">{errors.birthdate}</div>}
            </div>

            {/* Edad (number) */}
            <div className="mb-3">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                id="age"
                className={`form-control ${invalid('age') ? 'is-invalid' : ''}`}
                type="number"
                name="age"
                min={1}
                value={form.age}
                onChange={onInputChange}
                placeholder="Your age"
              />
              {invalid('age') && <div className="invalid-feedback">{errors.age}</div>}
            </div>

            {/* Experiencia (range) */}
            <div className="mb-3">
              <label className="form-label" htmlFor="experience">Experience: {form.experience} years</label>
              <input
                id="experience"
                className="form-range"
                type="range"
                name="experience"
                min={0}
                max={10}
                step={1}
                value={form.experience}
                onChange={onInputChange}
              />
            </div>

            {/* País (select) */}
            <div className="mb-3">
              <label className="form-label" htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                className="form-select"
                value={form.country}
                onChange={onInputChange}
              >
                <option value="MX">Mexico</option>
                <option value="US">United States</option>
                <option value="AR">Argentina</option>
                <option value="CO">Colombia</option>
                <option value="ES">Spain</option>
              </select>
            </div>

            {/* Bio (textarea) */}
            <div className="mb-3">
              <label className="form-label" htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                className="form-control"
                name="bio"
                rows={3}
                value={form.bio}
                onChange={onInputChange}
                placeholder="Tell us something about yourself"
              />
            </div>

            {/* Newsletter (checkbox) */}
            <div className="mb-3">
              <label className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="newsletter"
                  checked={form.newsletter}
                  onChange={onInputChange}
                />
                Subscribe to newsletter
              </label>
            </div>

            {/* Términos (checkbox obligatorio) */}
            <div className="mb-3">
              <label className="form-check">
                <input
                  className={`form-check-input ${invalid('agree') ? 'is-invalid' : ''}`}
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={onInputChange}
                />
                I accept the terms and conditions
              </label>
              {invalid('agree') && <div className="invalid-feedback">{errors.agree}</div>}
            </div>

            <div className="d-flex gap-2">
              <button className="btn" type="submit">Register</button>
              <button
                className="btn"
                type="button"
                onClick={() => { setForm({ ...form, name: "", email: "", password: "" }); }}
              >
                Clear basics
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}