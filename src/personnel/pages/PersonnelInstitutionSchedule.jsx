import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import createAxiosInstance from "../../config/api";
import "../../config/index.css";
import InstitutionSchedule from "../utils/InstitutionSchedule";

function PersonnelInstitutionDetail() {
  // const {Id} = useParams()
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get("/personnel/institution/schedule/list");
        setItem(response.data);
      } catch (err) {
        setError("일정 정보를 불러오지 못했습니다. 새로고침 해보세요");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);


  useEffect(() => {
    const handleDeleteRequest = async (event) => {
      if (event.data.type === 'deleteSchedule') {
        const {institutionId, scheduleId} = event.data;
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성

        const response = await axiosInstance
            .delete(`/personnel/institution/${institutionId}/schedule/${scheduleId}`)
            .then(() => {
              alert('일정이 삭제되었습니다.');
              window.location.reload(); // 부모 창 새로고침
            })
            .catch((error) => {
              alert('삭제 실패: ' + error.message);
            });
      }
    };
    window.addEventListener('message', handleDeleteRequest);
    return () => {
      window.removeEventListener('message', handleDeleteRequest);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoRegi = (Id) => {
    navigate(`/personnel/institution/${Id}/schedule/new`);
  };


  if (loading) return <p style={styles.errorMessage}>Loading...</p>;
  if (error) return <p style={styles.errorMessage}>{error}</p>;

  return (
      <div className="detail-container">

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3>교육기관 일정 관리</h3>
          </div>
          <div style={styles.cardBody}>
            <div style={styles.formGroup}>
              <InstitutionSchedule schedules={item}/>
            </div>
          </div>
          <button
              style={styles.actionButton}
              onClick={() => handleGoRegi("new")}
          >일정 추가
          </button>
          <button style={styles.actionButton} onClick={handleGoBack}>
            돌아가기
          </button>
        </div>
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
  actionButton2: {
    padding: "8px 12px",
    margin: "0 5px",
    backgroundColor: "rgb(76, 175, 80)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto"
  },
  actionButtonDanger: {
    backgroundColor: "rgb(76, 175, 80)",
  },
};

export default PersonnelInstitutionDetail;
