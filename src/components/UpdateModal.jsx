import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdateModal = ({ id, onClose }) => {
  const [formData, setFormData] = useState({
    judul_catatan: "",
    tanggal: "",
    ket_catatan: "",
    status_catatan: "Active", // Set default status
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/get/${id}`);
        // Memastikan data adalah array dan mengambil objek pertama
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const data = response.data[0]; // Mengambil data pertama dalam array
          setFormData({
            judul_catatan: data.judul_catatan || "",
            tanggal: data.tanggal || "",
            ket_catatan: data.ket_catatan || "",
            status_catatan: data.status_catatan || "", // Menetapkan default
          });
        }
      } catch (err) {
        setErrorMessage("Gagal mengambil data untuk diperbarui.");
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Token tidak ditemukan, silakan login kembali.");
        return;
      }

      // Mengonversi formData menjadi x-www-form-urlencoded
      const formBody = new URLSearchParams(formData).toString();

      const response = await axios.put(
        `http://localhost:8080/update/${id}`,
        {
          judul_catatan: formData.judul_catatan,
          tanggal: formData.tanggal,
          ket_catatan: formData.ket_catatan,
          status_catatan: formData.status_catatan,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onClose(); // Close modal after success
      }
    } catch (err) {
      setErrorMessage("Gagal memperbarui data.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900">
            Update Catatan
          </h3>

          {errorMessage && (
            <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label
                htmlFor="judul_catatan"
                className="block text-sm font-medium text-gray-700"
              >
                Judul
              </label>
              <input
                type="text"
                id="judul_catatan"
                name="judul_catatan"
                value={formData.judul_catatan || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="tanggal"
                className="block text-sm font-medium text-gray-700"
              >
                Tanggal
              </label>
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="ket_catatan"
                className="block text-sm font-medium text-gray-700"
              >
                Keterangan
              </label>
              <textarea
                id="ket_catatan"
                name="ket_catatan"
                value={formData.ket_catatan || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="status_catatan"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <input
                id="status_catatan"
                name="status_catatan"
                value={formData.status_catatan || ""}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateModal;
