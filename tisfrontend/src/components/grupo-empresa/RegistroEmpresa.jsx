import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegistroEmpresa.css";
import PlaceholderIMG from "../../assets/img/no-image.jpg";

const RegistroEmpresa = () => {
  const [nombre_empresa, setNombreEmpresa] = useState("");
  const [correo_empresa, setCorreoEmpresa] = useState("");
  const [nombre_representante, setNombreRepresentante] = useState("");
  const [telf_representante, setTelfRepresentante] = useState("");
  const [ID_docente, setIDDocente] = useState("");
  const [codigo, setCodigo] = useState("");
  const [logo_empresa, setLogoEmpresa] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const preset_name = "proyectoTIS";
  const cloud_name = "dlill8puk";

  // Generar código único
  useEffect(() => {
    const generateUniqueCode = () =>
      Math.random().toString(36).substring(2, 10).toUpperCase();
    setCodigo(generateUniqueCode());
  }, []);

  // Obtener lista de docentes
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/docentes")
      .then((response) => {
        if (response.data.success) {
          setDocentes(response.data.data);
        } else {
          console.error("Failed to fetch docentes");
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the docentes!", error);
      });
  }, []);

  // Previsualización de imagen
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile); // Guardar el archivo para su subida
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!file) {
      setError("Por favor, selecciona una imagen.");
      return;
    }
    if (telf_representante.length < 8) {
      setError("El número de la empresa es menor a 8 dígitos");
      return;
    }

    // Subir imagen a Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_name);

    try {
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const uploadData = await uploadResponse.json();
      setLogoEmpresa(uploadData.secure_url);

      // Enviar datos al backend
      const response = await axios.post(
        "http://localhost:8000/api/v1/grupo-empresa/register",
        {
          nombre_empresa,
          correo_empresa,
          nombre_representante,
          telf_representante,
          ID_docente,
          codigo,
          logo_empresa: uploadData.secure_url,
        },
      );

      if (response.data.success) {
        setSuccess(true);

        console.log("Registro exitoso:", response.data.data);
        navigate("/estudiante/info");
        window.location.reload();
      } else {
        setError("Ocurrió un error en el registro.");
      }
    } catch (err) {
      console.error("Error al registrar la empresa:", err);
      setError("Hubo un problema al registrar la empresa.");
    }
  };

  // Copiar código al portapapeles
  const copyToClipboard = (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(codigo)
      .then(() => alert("Código copiado al portapapeles!"))
      .catch((err) => console.error("Error al copiar el código: ", err));
  };

  return (
    <section className="w-full px-8 pt-8 lg:px-0">
      <form
        onSubmit={handleSubmit}
        className="mx-auto mb-8 rounded-md bg-neutral-300 px-10 py-5 lg:w-176"
      >
        <h2 className="mb-6 text-2xl font-semibold text-primary-800">
          Registro de grupo-empresa
        </h2>

        <section className="flex flex-col lg:flex-row lg:gap-5">
          <div className="flex w-full flex-col">
            <label htmlFor="nombre" className="font-semibold text-primary-800">
              Nombre de la empresa
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre_empresa}
              onChange={(e) => setNombreEmpresa(e.target.value)}
              className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
              placeholder="Ingresa el nombre"
              required
            />
          </div>

          <div className="flex w-full flex-col">
            <label
              htmlFor="representante"
              className="font-semibold text-primary-800"
            >
              Nombre representante legal
            </label>
            <input
              type="text"
              id="representante"
              value={nombre_representante}
              onChange={(e) => {
                const valor = e.target.value;
                // Permitir solo letras, espacios y caracteres específicos como acentos
                if (
                  /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(valor) &&
                  valor.length <= 30
                ) {
                  setNombreRepresentante(valor);
                }
              }}
              className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
              placeholder="Ingresa el nombre del representante"
              required
            />
          </div>
        </section>

        <section className="flex flex-col lg:flex-row lg:gap-5">
          <div className="flex w-full flex-col">
            <label htmlFor="correo" className="font-semibold text-primary-800">
              Correo electrónico de la empresa
            </label>
            <input
              type="email"
              id="correo"
              value={correo_empresa}
              onChange={(e) => setCorreoEmpresa(e.target.value)}
              className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
              placeholder="Ingresa el correo electrónico de la GE"
              required
            />
          </div>

          <div className="flex w-full flex-col">
            <label htmlFor="docente" className="font-semibold text-primary-800">
              Docente TIS asignado
            </label>
            <select
              id="docente"
              value={ID_docente}
              onChange={(e) => setIDDocente(e.target.value)}
              className="my-2 w-full cursor-pointer rounded-md border border-neutral-400 p-2 text-gray-800"
              required
            >
              <option value="" disabled selected>
                Selecciona un docente
              </option>
              {docentes.map((docente) => (
                <option key={docente.ID_docente} value={docente.ID_docente}>
                  {docente.nombre_usuario}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="flex gap-5">
          <div className="w-full">
            <div>
              <label
                htmlFor="numero"
                className="font-semibold text-primary-800"
              >
                Número del representante legal
              </label>
              <input
                type="number"
                id="numero"
                value={telf_representante}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,8}$/.test(value)) {
                    setTelfRepresentante(value);
                  }
                }}
                className="my-2 w-full rounded-md border border-neutral-400 p-2 text-gray-800"
                placeholder="Ingresa el número del representante"
                required
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-3">
              <span className="text-nowrap font-semibold text-primary-800">
                Código generado:
              </span>
              <div
                onClick={copyToClipboard}
                className="my-2 flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-md border border-neutral-400 bg-neutral-100 px-6 py-2 text-primary-800 transition-colors hover:border-neutral-500 lg:mx-auto"
              >
                <p className="font-bold">{codigo}</p>
                <i className="fa-solid fa-copy"></i>
              </div>
            </div>
          </div>
          <div className="w-full">
            <p className="font-semibold text-primary-800">Logo de la empresa</p>

            <div className="relative mt-2 flex flex-col items-center gap-3 lg:flex-row">
              <img
                src={logoPreview}
                className="relative z-10 size-28 rounded-xl object-cover"
              />
              <img
                src={PlaceholderIMG}
                className="absolute size-28 rounded-xl object-cover"
              />
              <label
                htmlFor="image"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-400 bg-neutral-100 px-2 py-1 text-center transition-colors hover:border-neutral-500"
              >
                <i className="fa-solid fa-arrow-up-from-bracket"></i>
                <p className="leading-tight">Seleccionar archivo </p>
              </label>
            </div>

            <input
              type="file"
              id="image"
              accept="image/jpeg, image/png, image/gif"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </section>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Registro exitoso!</p>}

        <button
          type="submit"
          className="text- mt-6 w-full rounded-md bg-primary-600 py-3 font-semibold text-white transition-colors hover:bg-primary-500"
        >
          Registrar empresa
        </button>
      </form>
    </section>
  );
};

export default RegistroEmpresa;
