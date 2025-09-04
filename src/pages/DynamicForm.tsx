import { useMemo, useState, type JSX } from "react";

// =====================
// Types
// =====================
export type FieldBase = {
  key: string; // result object key
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "date"
    | "radio";
  label?: string;
  placeholder?: string;
  helper?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // regex string
  defaultValue?: any;
  options?: { label: string; value: string | number }[]; // for select/radio
};

export type FormSchema = {
  title?: string;
  description?: string;
  submitText?: string;
  fields: FieldBase[];
};

export type DynamicFormProps = {
  schema: FormSchema;
  onSubmit: (values: Record<string, any>) => void;
  customRenderers?: Record<string, (p: RendererProps) => JSX.Element>; // custom components
};

export type RendererProps = {
  field: FieldBase;
  value: any;
  setValue: (v: any) => void;
  error?: string | null;
};

// =====================
// Built-in field renderers
// =====================
const builtinRenderers: Record<FieldBase["type"], (p: RendererProps) => JSX.Element> = {
  text: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type="text"
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  email: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type="email"
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  password: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type="password"
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  number: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type="number"
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
        min={field.min}
        max={field.max}
      />
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  textarea: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <textarea
        className={`form-control ${error ? "is-invalid" : ""}`}
        rows={3}
        placeholder={field.placeholder}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  select: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <select
        className={`form-select ${error ? "is-invalid" : ""}`}
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      >
        <option value="">Select an option</option>
        {(field.options ?? []).map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  checkbox: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      <div className="form-check">
        <input
          className={`form-check-input ${error ? "is-invalid" : ""}`}
          id={field.key}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => setValue(e.target.checked)}
        />
        <label className="form-check-label" htmlFor={field.key}>
          {field.label ?? field.key}
        </label>
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
    </div>
  ),
  date: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label">{field.label}</label>}
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type="date"
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
      />
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ),
  radio: ({ field, value, setValue, error }) => (
    <div className="mb-3">
      {field.label && <label className="form-label d-block">{field.label}</label>}
      {(field.options ?? []).map((opt) => (
        <div className="form-check form-check-inline" key={String(opt.value)}>
          <input
            className={`form-check-input ${error ? "is-invalid" : ""}`}
            type="radio"
            name={field.key}
            id={`${field.key}-${opt.value}`}
            value={String(opt.value)}
            checked={String(value ?? "") === String(opt.value)}
            onChange={(e) => setValue(e.target.value)}
          />
          <label className="form-check-label" htmlFor={`${field.key}-${opt.value}`}>
            {opt.label}
          </label>
        </div>
      ))}
      {error && <div className="invalid-feedback d-block">{error}</div>}
      {field.helper && !error && <div className="form-text">{field.helper}</div>}
    </div>
  ),
};

// =====================
// Validation
// =====================
function validateField(field: FieldBase, value: any): string | null {
  if (field.required) {
    const empty =
      value === null ||
      value === undefined ||
      value === "" ||
      (field.type === "checkbox" && !value);
    if (empty) return "This field is required";
  }
  if (field.type === "email" && value) {
    const ok = /\S+@\S+\.\S+/.test(String(value));
    if (!ok) return "Invalid email";
  }
  if (typeof value === "string") {
    if (field.minLength && value.length < field.minLength)
      return `Minimum ${field.minLength} characters`;
    if (field.maxLength && value.length > field.maxLength)
      return `Maximum ${field.maxLength} characters`;
    if (field.pattern) {
      try {
        const re = new RegExp(field.pattern);
        if (!re.test(value)) return "Invalid format";
      } catch {
        // invalid pattern: ignore pattern error, do not block user
      }
    }
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    if (field.min !== undefined && value < field.min)
      return `Minimum ${field.min}`;
    if (field.max !== undefined && value > field.max)
      return `Maximum ${field.max}`;
  }
  return null;
}

// =====================
// DynamicForm component (renderer)
// =====================
export function DynamicForm({ schema, onSubmit, customRenderers = {} }: DynamicFormProps) {
  const initialValues = useMemo(() => {
    const acc: Record<string, any> = {};
    for (const f of schema.fields) {
      acc[f.key] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    }
    return acc;
  }, [schema]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const setValue = (key: string, v: any) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    // live validation per field
    const field = schema.fields.find((f) => f.key === key)!;
    setErrors((prev) => ({ ...prev, [key]: validateField(field, v) }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string | null> = {};
    for (const f of schema.fields) {
      newErrors[f.key] = validateField(f, values[f.key]);
    }
    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (!hasError) onSubmit(values);
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      {schema.title && <h2 className="my-3">{schema.title}</h2>}
      {schema.description && (
        <p className="text-muted" style={{ marginTop: -8 }}>
          {schema.description}
        </p>
      )}
      <form onSubmit={submit} noValidate>
        {schema.fields.map((field) => {
          const renderer =
            (customRenderers as any)[field.type] ||
            (builtinRenderers as any)[field.type];
          if (!renderer)
            return (
              <p key={field.key} className="text-danger">
                Unsupported field type: {field.type}
              </p>
            );
          return (
            <div key={field.key}>
              {renderer({
                field,
                value: values[field.key],
                setValue: (v: any) => setValue(field.key, v),
                error: errors[field.key],
              })}
            </div>
          );
        })}
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">
            {schema.submitText ?? "Submit"}
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setValues(initialValues);
              setErrors({});
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

// =====================
// Demo Page with Live JSON Editor
// =====================
const initialSchema: FormSchema = {
  title: "Dynamic JSON-driven Form",
  description:
    "This form is rendered dynamically from the JSON schema on the left. Edit the JSON and see the form update in real time.",
  submitText: "Create account",
  fields: [
    {
      key: "name",
      type: "text",
      label: "Name",
      required: true,
      minLength: 2,
      placeholder: "Your full name",
    },
    {
      key: "email",
      type: "email",
      label: "Email",
      required: true,
      placeholder: "you@example.com",
    },
    {
      key: "password",
      type: "password",
      label: "Password",
      required: true,
      minLength: 6,
      placeholder: "At least 6 characters",
    },
    { key: "age", type: "number", label: "Age", min: 1, max: 120 },
    { key: "birthdate", type: "date", label: "Birth date" },
    {
      key: "role",
      type: "select",
      label: "Role",
      required: true,
      options: [
        { label: "Frontend", value: "fe" },
        { label: "Backend", value: "be" },
        { label: "Fullstack", value: "fs" },
      ],
    },
    {
      key: "gender",
      type: "radio",
      label: "Gender",
      options: [
        { label: "Male", value: "m" },
        { label: "Female", value: "f" },
        { label: "Other", value: "x" },
      ],
      required: true,
    },
    {
      key: "newsletter",
      type: "checkbox",
      label: "Subscribe to the newsletter",
      defaultValue: true,
    },
    {
      key: "bio",
      type: "textarea",
      label: "Bio",
      maxLength: 200,
      helper: "Maximum 200 characters",
    },
  ],
};
 function DynamicFormDemo() {
  const [schemaText, setSchemaText] = useState<string>(
    JSON.stringify(initialSchema, null, 2)
  );
  const [schema, setSchema] = useState<FormSchema>(initialSchema);
  const [parseError, setParseError] = useState<string | null>(null);

  // Try to parse the JSON as the user types
  const onSchemaChange = (text: string) => {
    setSchemaText(text);
    try {
      const parsed = JSON.parse(text) as FormSchema;
      if (!parsed || !Array.isArray(parsed.fields)) {
        throw new Error("Schema must contain a 'fields' array");
      }
      setSchema(parsed);
      setParseError(null);
    } catch (err: any) {
      setParseError(err?.message ?? "Invalid JSON");
    }
  };

  return (
    <div className="container my-4">
      <h1 className="h3 mb-3">Dynamic JSON-driven Forms</h1>
      <p className="mb-4">
        Build forms from a JSON schema. Edit the schema on the left and preview the
        form on the right in real time. This is a lightweight, extensible
        Formly-like approach without extra dependencies.
      </p>

      <div className="row g-4">
        {/* Left: JSON editor */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between">
              <span>Schema (editable JSON)</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setSchemaText(JSON.stringify(initialSchema, null, 2))}
                  title="Reset to initial schema"
                >
                  Reset
                </button>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigator.clipboard?.writeText(schemaText)}
                  title="Copy JSON to clipboard"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              <textarea
                className="form-control border-0 rounded-0"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
                  fontSize: 14,
                  minHeight: 1000,
                }}
                value={schemaText}
                onChange={(e) => onSchemaChange(e.target.value)}
                spellCheck={false}
              />
            </div>
            {parseError ? (
              <div className="card-footer text-danger small">{parseError}</div>
            ) : (
              <div className="card-footer text-muted small">JSON is valid ✔️</div>
            )}
          </div>
        </div>

        {/* Right: Form preview */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-header">Live Preview</div>
            <div className="card-body">
              <DynamicForm
                schema={schema}
                onSubmit={(values) => {
                  alert("Form submitted ✅ (check the console)");
                  console.log("values:", values);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DynamicFormDemo;