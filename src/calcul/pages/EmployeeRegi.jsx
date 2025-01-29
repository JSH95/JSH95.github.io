import React, { useState } from "react";
import { EmployeeRegiApi } from "../utils/EmployeeRegiApi";
import "../../config/index.css";

const EmployeeRegi = () => {
  const { addEmployee, loading, error, responseMessage } = EmployeeRegiApi(); // API 상태 가져오기
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    entryDate: "",
    exitDate: "",
    employeeType: "",
    conversionDate: "",
    rank: "",
    status: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEmployee(formData); // API 호출
    if (!error) {
      // 성공 시 폼 초기화
      setFormData({
        id: "",
        name: "",
        entryDate: "",
        exitDate: "",
        employeeType: "",
        conversionDate: "",
        rank: "",
        status: 0,
      });
    }
  };

  return (
    <div className="detail-container">
      <h2 className="title">사원 등록 페이지</h2>
      {responseMessage && !error && (
        <p className="success-message">{responseMessage}</p>
      )}
      {error && !responseMessage && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="employee-regi-form">
        <div className="form-group">
          <label>ID</label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label>입사일</label>
          <input
            type="date"
            name="entryDate"
            value={formData.entryDate}
            onChange={handleChange}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label>퇴사일 (선택)</label>
          <input
            type="date"
            name="exitDate"
            value={formData.exitDate}
            onChange={handleChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label>직원 유형</label>
          <select
            name="employeeType"
            value={formData.employeeType}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="" disabled>
              직원 유형을 선택해 주세요
            </option>
            <option value="CONTRACT">계약직</option>
            <option value="REGULAR">정규직</option>
          </select>
        </div>
        {formData.employeeType === "REGULAR" && (
          <div className="form-group">
            <label>전환일 (정규직만 입력)</label>
            <input
              type="date"
              name="conversionDate"
              value={formData.conversionDate}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        )}
        <div className="form-group">
          <label>직급</label>
          <select
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            className="input"
            required
          >
            <option value="" disabled>
              직급을 선택해 주세요
            </option>
            <option value={0}>사원</option>
            <option value={1}>주임</option>
            <option value={2}>계장</option>
            <option value={3}>부장</option>
            <option value={4}>사장</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "등록 중..." : "직원 등록"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegi;
