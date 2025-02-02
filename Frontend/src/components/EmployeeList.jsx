import { useEffect, useState } from "react";
import Employee from "./Employee";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);

  useEffect(() => {
    refreshEmployeeList();
  }, []);

  const employeeAPI = (url = "http://localhost:8000/api/Employee/") => {
    return {
      fetchAll: () => axios.get(url),
      create: (newRecord) => axios.post(url, newRecord),
      pdate: (id, updatedRecord) => axios.put(url + id, updatedRecord),
      delete: (id) => axios.delete(url + id),
    };
  };

  function refreshEmployeeList() {
    employeeAPI()
      .fetchAll()
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.log(err));
  }

  const addOrEdit = (formData, onSuccess) => {
    if (formData.get("employeeID") == "0")
      employeeAPI()
        .create(formData)
        .then((res) => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
    else
      employeeAPI()
        .update(formData.get("employeeID"), formData)
        .then((res) => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
  };

  const showRecordDetails = (data) => {
    setRecordForEdit(data);
  };

  const onDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this record?"))
      employeeAPI()
        .delete(id)
        .then(() => {
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
  };

  const imageCard = data => (
    <div className="card" onClick={() => { showRecordDetails(data) }}>
        <img src={data.imageSrc} className="card-img-top rounded-circle" />
        <div className="card-body">
            <h5>{data.employeeName}</h5>
            <span>{data.occupation}</span> <br />
            <button className="btn btn-light delete-button" onClick={e => onDelete(e, parseInt(data.employeeID))}>
                <i className="far fa-trash-alt"></i>
            </button>
        </div>
    </div>
  )

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="jumbotron jumbotron-fluid py-4">
          <div className="container text-center">
            <h1 className="display-4">Employee Register</h1>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <Employee addOrEdit={addOrEdit} recordForEdit={recordForEdit} />
      </div>
      <div className="col-md-8">
        <table>
          <tbody>
            {[...Array(Math.ceil(employees.length / 3))].map((e, i) => (
              <tr key={i}>
                <td>{imageCard(employees[3 * i])}</td>
                <td>
                  {employees[3 * i + 1]
                    ? imageCard(employees[3 * i + 1])
                    : null}
                </td>
                <td>
                  {employees[3 * i + 2]
                    ? imageCard(employees[3 * i + 2])
                    : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;