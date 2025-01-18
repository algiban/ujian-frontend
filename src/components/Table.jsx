import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateModal from "./UpdateModal"; // Pastikan impor dengan benar

const Table = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [openedItemId, setOpenedItemId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Define setErrorMessage here

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan, silakan login kembali.");
        return;
      }

      const response = await axios.get("http://localhost:8080/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan, silakan login kembali.");
        return;
      }

      const response = await axios.delete(
        `http://localhost:8080/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        setErrorMessage("Data berhasil dihapus.");
      }
    } catch (err) {
      setErrorMessage("Gagal menghapus data.");
    }
  };

  const handleOpenUpdateModal = (id) => {
    setOpenedItemId(id); // Set the id of the item to update
  };

  const handleCloseModal = () => {
    setOpenedItemId(null); // Close the modal
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Judul
            </th>
            <th scope="col" className="px-6 py-3">
              Tanggal
            </th>
            <th scope="col" className="px-6 py-3">
              Keterangan
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.judul_catatan}
                </th>
                <td className="px-6 py-4">{item.tanggal}</td>
                <td className="px-6 py-4">{item.ket_catatan}</td>
                <td className="px-6 py-4">{item.status_catatan}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleOpenUpdateModal(item.id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-4 font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Tidak ada catatan ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {openedItemId && (
        <UpdateModal id={openedItemId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Table;
