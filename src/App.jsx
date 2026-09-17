import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StudentDetail from "./StudentDetail";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import "./App.css";

const API_URL = "https://student-management-api-production-183e.up.railway.app/api/students";

function App() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    course: "",
    class: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get students with pagination and search
  const fetchStudents = async (page = 1, searchValue = search) => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: page,
          search: searchValue,
        },
      });

      setStudents(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setTotalStudents(response.data.total);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Live Search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchStudents(1, search);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search]);
  useEffect(() => {
  if (editingId) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [editingId]);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // Create / Update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("mobile", formData.mobile);
      data.append("course", formData.course);
      data.append("class", formData.class);
      data.append("address", formData.address);

      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        data.append("_method", "PUT");

        await axios.post(`${API_URL}/${editingId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Student updated successfully!");
      } else {
        await axios.post(API_URL, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Student created successfully!");
      }

      resetForm();
      fetchStudents(currentPage, search);
    } catch (error) {
      console.error("Error:", error);

      if (error.response?.data?.errors) {
        alert("Please enter valid student details.");
      } else {
        alert("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

// Edit student
const handleEdit = (student) => {
  setEditingId(student.id);

  setFormData({
    name: student.name,
    email: student.email,
    mobile: student.mobile,
    course: student.course,
    class: student.class,
    address: student.address,
  });

  setImage(null);
  setPreview(student.image_url);

  // Scroll to student form
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 200);
};
  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);

      alert("Student deleted successfully!");

      fetchStudents(currentPage, search);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Unable to delete student.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      course: "",
      class: "",
      address: "",
    });

    setImage(null);
    setPreview(null);
    setEditingId(null);
  };

  // Previous Page
  const handlePrevious = () => {
    if (currentPage > 1) {
      fetchStudents(currentPage - 1, search);
    }
  };

  // Next Page
  const handleNext = () => {
    if (currentPage < lastPage) {
      fetchStudents(currentPage + 1, search);
    }
  };

 return (
  <>
   <Helmet>
  <title>Student Management System - Manage Students</title>

  <meta
    name="description"
    content="Student Management System for managing student records, courses, classes, contact details and student information."
  />

  <meta name="robots" content="noindex, nofollow" />

  <link
    rel="canonical"
    href={window.location.origin}
  />

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Student Management System",
      description:
        "Student Management System for managing student records, courses, classes, contact details and student information.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
    })}
  </script>
</Helmet>

    <div className="container">

      <h1>Student Management System</h1>

      {/* Student Form */}
      <div className="form-card" id="student-form">

        <h2>
          {editingId ? "Update Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Enter mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Enter course"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="class"
            placeholder="Enter class"
            value={formData.class}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>

          {/* Image Upload */}
          <div className="image-upload">

            <label>Student Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Image Preview */}
            {preview && (
              <div className="preview-box">
                <img
                  src={preview}
                  alt="Student Preview"
                  className="image-preview"
                />
              </div>
            )}

          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Student"
              : "Add Student"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* Student List */}
      <div className="table-card">

        {/* Table Header */}
        <div className="table-header">

          <h2>Student List</h2>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <span>🔍</span>

          </div>

        </div>

        {/* Student Table */}
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <>
            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Course</th>
                  <th>Class</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {students.map((student) => (
                  <tr key={student.id}>

                    <td>{student.id}</td>

                    <td>
                      {student.image_url ? (
                        <img
                          src={student.image_url}
                          alt={student.name}
                          className="student-image"
                        />
                      ) : (
                        <span className="no-image">
                          No Image
                        </span>
                      )}
                    </td>

                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.mobile}</td>

                    <td>{student.course}</td>

                    <td>{student.class}</td>

                    <td>{student.address}</td>

                   <td>

  <Link
    to={`/students/${student.slug}`}
    className="view-btn"
  >
    View
  </Link>

  <button
    className="edit-btn"
    onClick={() => handleEdit(student)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDelete(student.id)}
  >
    Delete
  </button>

</td>

                  </tr>
                ))}

              </tbody>

            </table>

            {/* Pagination */}
            <div className="pagination">

              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {lastPage}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === lastPage}
              >
                Next
              </button>

            </div>

            <p className="total-count">
              Total Students: {totalStudents}
            </p>

          </>
        )}

      </div>

    </div>
      </>
  );
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route
                    path="/students/:slug"
                    element={<StudentDetail />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;