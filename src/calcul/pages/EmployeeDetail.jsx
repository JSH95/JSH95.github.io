import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEmployeeTypeText, getRankText } from "../../utils/textUtils";
import createAxiosInstance from "../../config/api";
import "../../config/index.css";

function EmployeeDetail() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get(`/employees/${employeeId}`);
        setItem(response.data);
        setEditedItem(response.data);
      } catch (err) {
        setError("직원 정보를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const confirmSave = window.confirm("해당 직원을 수정하시겠습니까?");
    if (!confirmSave) {
      return;
    } else {
      try {
        if (editedItem.rank === "" && editedItem.employeeType === "") {
          alert("입력되지 않은 값이 있습니다. 다시 한번 확인해 주세요."); // 직급이 선택되지 않으면 경고 메시지 표시
          return;
        }
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.put(
          `/employees/${employeeId}`,
          editedItem
        );
        setItem(response.data);
        setIsEditing(false);
        window.alert("직원 수정을 완료했습니다");
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // 404 에러에 대한 처리
          window.alert("입력된 값을 다시 한번 확인해 주세요");
        } else {
          // 기타 에러에 대한 처리
          setError("직원 정보를 저장하는 데 실패했습니다.");
        }
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  //직원 삭제 시 퇴직일 여부 판단하여 삭제 진행
  const handleDelete = async (id) => {
    if (editedItem.exitDate == null) {
      const confirmDelete = window.confirm("퇴직일이 설정되 있지 않습니다. \n 퇴직일을 오늘 날짜로 설정 하시겠습니까?");
      if (!confirmDelete) return;
      editedItem.exitDate = new Date().toISOString().split("T")[0];
      await handleSave(editedItem); // 퇴직일 저장 처리
    }else {
      const confirmDelete = window.confirm("직원을 삭제하시겠습니까?");
      if (!confirmDelete) return;
    }

    try {
      const axiosInstance = createAxiosInstance(); // 인스턴스 생성
      const response = await axiosInstance.post(
          `/employees/${id}`
      );
      if (response.status === 200) {
        alert("직원이 성공적으로 삭제되었습니다.");
        navigate("/employee"); // 삭제 후 직원 목록 페이지로 이동
      } else if (response.status === 404) {
        alert("해당 직원은 존재하지 않습니다.");
      }
    } catch (err) {
      alert("직원 삭제에 실패했습니다.");
      console.error(err);
    }
  };

  if (loading) return <p style={styles.errorMessage}>Loading...</p>;
  if (error) return <p style={styles.errorMessage}>{error}</p>;

  return (
    <div className="detail-container">
      {item && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>{item.name}의 상세정보</h3>
          </div>
          <div style={styles.cardBody}>
            {isEditing ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>직원 아이디</label>
                  <input
                    style={styles.input}
                    name="id"
                    value={editedItem.id}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>직원 이름</label>
                  <input
                    style={styles.input}
                    name="name"
                    value={editedItem.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>입사일</label>
                  <input
                    type="date"
                    style={styles.input}
                    name="entryDate"
                    value={editedItem.entryDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>퇴사일</label>
                  <input
                    type="date"
                    style={styles.input}
                    name="exitDate"
                    value={editedItem.exitDate || ""}
                    onChange={handleChange}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>직원 유형</label>
                  <select
                    style={styles.input}
                    name="employeeType"
                    value={editedItem.employeeType}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    <option value="CONTRACT">계약직</option>
                    <option value="REGULAR">정규직</option>
                  </select>
                </div>
                {editedItem.employeeType === "REGULAR" && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>전환 날짜</label>
                      <input
                          type="date"
                          style={styles.input}
                          name="conversionDate"
                          value={editedItem.conversionDate|| ""}
                          onChange={handleChange}
                          required
                          className="input"
                      />
                    </div>
                )}
                <div style={styles.formGroup}>
                  <label style={styles.label}>직급</label>
                  <select
                    style={styles.input}
                    name="rank"
                    value={editedItem.rank}
                    onChange={handleChange}
                    required
                  >
                    <option value={0}>사원</option>
                    <option value={1}>주임</option>
                    <option value={2}>계장</option>
                    <option value={3}>부장</option>
                    <option value={4}>사장</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>직원 아이디</label>
                  <div style={styles.box}>
                    <p>{item.id}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>직원 이름</label>
                  <div style={styles.box}>
                    <p>{item.name}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>입사일</label>
                  <div style={styles.box}>
                    <p>{item.entryDate}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>퇴사일</label>
                  <div style={styles.box}>
                    <p>{item.exitDate ? item.exitDate : "재직중"}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>계약 상태</label>
                  <div style={styles.box}>
                    <p>
                      {" "}
                      {getEmployeeTypeText(item.employeeType, item.status)}
                    </p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>전환 날짜</label>
                  <div style={styles.box}>
                    <p>{item.conversionDate ? item.conversionDate : "없음"}</p>
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>직급</label>
                  <div style={styles.box}>
                    <p>{getRankText(item.rank)}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div style={styles.cardFooter}>
            {isEditing ? (
              <button style={styles.actionButton} onClick={handleSave}>
                저장
              </button>
            ) : (
              <button style={styles.actionButton} onClick={handleEditClick}>
                수정
              </button>
            )}
            {!isEditing && (
              <button
                style={{ ...styles.actionButton, ...styles.actionButtonDanger }}
                onClick={() => handleDelete(item.id)}
              >삭제</button>
            )}
            <button style={styles.actionButton} onClick={handleGoBack}>
              돌아가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    max_width: "600px",
    margin: "0 auto",
    background: "#f9f9f9",
  },
  card: {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
  },
  cardBody: {
    padding: "20px",
  },
  cardFooter: {
    padding: "10px",
    textAlign: "right",
    borderTop: "1px solid #ddd",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box",
  },
  box: {
    padding: "10px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    margin: "20px",
  },
  actionButton: {
    padding: "8px 12px",
    margin: "0 5px",
    backgroundColor: "rgb(76, 175, 80)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  actionButtonDanger: {
    backgroundColor: "rgb(76, 175, 80)",
  },
};

export default EmployeeDetail;
