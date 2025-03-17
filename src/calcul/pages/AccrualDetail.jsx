import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../config/index.css";
import createAxiosInstance from "../../config/api";

import {
  getRankText,
  getEmployeeTypeText,
  getStateText,
  formatAmount,
} from "../../utils/textUtils";

const EmployeeDetailPage = () => {
  const { employeeId } = useParams(); // URL에서 employeeId 가져오기
  const [item, setItem] = useState(null); // 유저 정보 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 서버에서 유저 상세 정보 가져오기
    const fetchEmployee = async () => {
      try {
        const axiosInstance = createAxiosInstance(); // 인스턴스 생성
        const response = await axiosInstance.get(
          `/employees/${employeeId}/accrual`
        );
        setItem(response.data);
      } catch (err) {
        setError("유저 정보를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container ">
      <div className="title">
        <h2>{item.employee.name} 의 퇴직금 상세정보</h2>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-md-6">
          <div  className="card">
            {item ? (
                <div className="card-body">
                  <div className="form-group">
                    <label className="label">이름</label>
                    <p className="box">{item.employee.name}</p>
                  </div>
                  <div className="form-group">
                    <label className="label">계약 상태</label>
                    <p className="box">
                      {getEmployeeTypeText(
                          item.employee.employeeType,
                          item.employee.status
                      )}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="label">직책</label>
                    <p className="box">{getRankText(item.employee.rank)}</p>
                  </div>
                  <div className="form-group">
                    <label className="label">지급 상태</label>
                    <p className="box">{getStateText(item.state)}</p>
                  </div>
                  <div className="form-group">
                    <label className="label">정직원 전환 일</label>
                    <p className="box">{item.employee.conversionDate}</p>
                  </div>
                  <div className="form-group">
                    <label className="label">예상 퇴직금</label>
                    <p className="box">
                      {formatAmount(item.totalAmount ? item.totalAmount : "0")}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="label">퇴사일</label>
                    <p className="box">
                      {item.employee.exitDate ? item.employee.exitDate : "재직중"}
                    </p>
                  </div>
                </div>
            ) : (
                <p>유저 정보를 찾을 수 없습니다.</p>
            )}
          </div>
        </div>
      </div>
      </div>
  );
};

export default EmployeeDetailPage;

// Styled Components
// const Container = styled.div`
//   padding: 2rem;
//   max-width: 700px;
//   margin: 0 auto;
// `;

// const Title = styled.h1`
//   font-size: 2rem;
//   margin-bottom: 1.5rem;
//   text-align: center;
// `;

// const DetailsTable = styled.div`
//   display: table;
//   width: 100%;
//   border-collapse: collapse;
//   background-color: #f9f9f9;
//   border: 1px solid #ddd;
// `;

// const Row = styled.div`
//   display: table-row;
// `;
// const CellLeft = styled.div`
//   display: table-cell;
//   padding: 0.8rem 1rem;
//   background-color: #f0f0f0;
//   font-weight: bold;
//   border: 1px solid #ddd;
//   text-align: left;
// `;

// const CellRight = styled.div`
//   display: table-cell;
//   padding: 0.8rem 1rem;
//   border: 1px solid #ddd;
//   text-align: left;
// `;

// const Loading = styled.div`
//   text-align: center;
//   font-size: 1.5rem;
//   margin-top: 2rem;
// `;

// const Error = styled.div`
//   color: red;
//   text-align: center;
//   font-size: 1.2rem;
//   margin-top: 2rem;
// `;
