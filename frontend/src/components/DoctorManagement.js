import React, { useState, useEffect } from 'react';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialization: '' });

    useEffect(() => {
        // Fetch initial doctor data (mocked for now)
        const fetchDoctors = async () => {
            const mockDoctors = [
                { id: 1, name: 'Dr. Smith', specialization: 'Cardiology' },
                { id: 2, name: 'Dr. Johnson', specialization: 'Neurology' },
            ];
            setDoctors(mockDoctors);
        };
        fetchDoctors();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor({ ...newDoctor, [name]: value });
    };

    const addDoctor = () => {
        if (newDoctor.name && newDoctor.specialization) {
            setDoctors([...doctors, { id: Date.now(), ...newDoctor }]);
            setNewDoctor({ name: '', specialization: '' });
        }
    };

    const deleteDoctor = (id) => {
        setDoctors(doctors.filter((doctor) => doctor.id !== id));
    };

    return (
        <div>
            <h1>Doctor Management</h1>
            <div>
                <h2>Add New Doctor</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Doctor Name"
                    value={newDoctor.name}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="specialization"
                    placeholder="Specialization"
                    value={newDoctor.specialization}
                    onChange={handleInputChange}
                />
                <button onClick={addDoctor}>Add Doctor</button>
            </div>
            <div>
                <h2>Doctor List</h2>
                <ul>
                    {doctors.map((doctor) => (
                        <li key={doctor.id}>
                            {doctor.name} - {doctor.specialization}
                            <button onClick={() => deleteDoctor(doctor.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DoctorManagement;