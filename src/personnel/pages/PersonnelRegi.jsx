import React, {useEffect, useState} from "react";
import "../../config/index.css";
import createAxiosInstance from "../../config/api";
import {InstitutionListApi} from "../utils/InstitutionListApi";

function PersonnelRegi() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    email: "",
    birthDate: "",
    phoneNumber: "",
    institutionId: "",
    joiningDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const { loadList, institutionList} = InstitutionListApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 제출 동작 방지
    const confirmSave = window.confirm("해당 지원자를 저장하시겠습니까?");
      if (!confirmSave) {
        return;
      }
      setLoading(true);
      setError("");
      setResponseMessage(""); // 상태 초기화
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.post("/personnel/applicant/add", formData);
        setResponseMessage(response.data);
        setFormData({
          name: "",
          gender: "",
          email: "",
          birthDate: "",
          phoneNumber: "",
          institutionId: "",
          joiningDate: "",
        });
      } catch (err) {
        if (err.response) {
          setError('등록 실패 : ${err.response.data.message || "서버 오류"}');
        } else if (err.request) {
          setError("등록 실패: 서버로부터 응답이 없습니다." + err.request);
        } else {
          setError("등록 실패 : ${err.message}");
        }
      }
      finally {
        setLoading(false);
      }
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="detail-container">
      <h2 className="title">지원자 등록 페이지</h2>
      {responseMessage && !error && (
        <p className="success-message">{responseMessage}</p>
      )}
      {error && !responseMessage && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
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
          <label>성별</label>
          <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input"
              required
          >
            <option value="" disabled>
              성별을 선택해 주세요
            </option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </div>
        <div className="form-group">
          <label>email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label>생년월일</label>
          <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="input"
              required
          />
        </div>
          <div className="form-group">
            <label>휴대폰번호</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
      <div className="form-group">
        <label>소속 기관</label>
        <select
            name="institutionId"
            value={formData.institutionId || ""}
            onChange={handleChange}
            required
            className="input"
        >
          <option value="" disabled>
            소속 기관을 선택해 주세요
          </option>
          {institutionList && institutionList.length > 0 ? (
              institutionList.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
              ))
          ) : (
              <option value="" disabled>
                Loading...
              </option>
          )}
        </select>
      </div>
        <div className="form-group">
          <label>지원일</label>
          <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              required
              className="input"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "등록 중..." : "지원자 등록"}
        </button>
      </form>
    </div>
  );
};

export default PersonnelRegi;
