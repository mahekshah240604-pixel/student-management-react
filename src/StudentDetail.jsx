import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

function StudentDetail() {
    const { slug } = useParams();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/students/slug/${slug}`
                );

                setStudent(response.data.data);
            } catch (err) {
                setError("Student not found.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudent();
    }, [slug]);

    if (loading) {
        return <h2>Loading student...</h2>;
    }

    if (error || !student) {
        return (
            <div className="container">
                <h2>Student not found</h2>

                <Link to="/">
                    Back to Student List
                </Link>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>
                    {student.name} - Student Management System
                </title>

                <meta
                    name="description"
                    content={`View student information for ${student.name}, including course, class and contact details.`}
                />

                <meta
                    name="robots"
                    content="noindex, nofollow"
                />

                <link
                    rel="canonical"
                    href={`${window.location.origin}/students/${student.slug}`}
                />
            </Helmet>

            <div className="container">
                <h1>{student.name}</h1>

                <h2>Student Details</h2>

                {student.image_url && (
                    <img
                        src={student.image_url}
                        alt={`${student.name} - Student`}
                        style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                    />
                )}

                <div style={{ marginTop: "20px" }}>
                    <p>
                        <strong>Name:</strong> {student.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {student.email}
                    </p>

                    <p>
                        <strong>Mobile:</strong> {student.mobile}
                    </p>

                    <p>
                        <strong>Course:</strong> {student.course}
                    </p>

                    <p>
                        <strong>Class:</strong> {student.class}
                    </p>

                    <p>
                        <strong>Address:</strong> {student.address}
                    </p>
                </div>

                <Link to="/">
                    Back to Student List
                </Link>
            </div>
        </>
    );
}

export default StudentDetail;