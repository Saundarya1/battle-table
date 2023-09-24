import './App.scss';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import mech from './assets/images/mech-img.jpg';
import { mechs } from './assets/arrays/mechs';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PercentTable from '../src/components/PercentTable';
import Filters from '../src/components/Filters';
import html2canvas from '../node_modules/html2canvas/dist/html2canvas';
import jsPDF from '../node_modules/jspdf/dist/jspdf.es';

const initialData = mechs;


function App() {

  const FirstArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const ThirdArray = [2.42, 2.31, 2.21, 2.1, 1.93, 1.75, 1.68, 1.59, 1.5, 2.21, 2.11, 2.02, 1.92, 1.76, 1.6, 1.54, 1.46, 1.38, 1.93, 1.85, 1.76, 1.68, 1.54, 1.4, 1.35, 1.28, 1.21, 1.66, 1.58, 1.51, 1.44, 1.32, 1.2, 1.16, 1.1, 1.04, 1.38, 1.32, 1.26, 1.2, 1.1, 1, 0.95, 0.9, 0.85, 1.31, 1.19, 1.13, 1.08, 0.99, 0.9, 0.86, 0.81, 0.77, 1.24, 1.12, 1.07, 1.02, 0.94, 0.85, 0.81, 0.77, 0.72, 1.17, 1.06, 1.01, 0.96, 0.88, 0.8, 0.76, 0.72, 0.68, 1.1, 0.99, 0.95, 0.9, 0.83, 0.75, 0.71, 0.68, 0.64];

  const [selectedRows, setSelectedRow] = useState([]);
  const [tableData, setTableData] = useState(initialData);
  const [Piloting, setPiloting] = useState(5);
  const [Gunnery, setGunnery] = useState(4);
  const [lanceBV, setLanceBV] = useState(0);

  const tableRef = useRef(null);


  const addToLance = (row, lanceBV, calculatedBV) => {
    const newRow = {
      ...row,
    };

    const calculated = lanceBV - calculatedBV;

    if (calculated < 0) {
      alert('Not enough BV!')
    } else {
      setLanceBV(calculated);
      setSelectedRow(prevSelectedRow => [...prevSelectedRow, newRow]);
      return calculated;
    }

  }


  // add REFRESH button

  const cutFromLance = (row, lanceBV, calculatedBV) => {

    const addBack = lanceBV + calculatedBV;
    const updateUserTable = selectedRows.filter(selectedRow => selectedRow !== row);

    setLanceBV(addBack);
    setSelectedRow(updateUserTable);

  }

  const handleLanceBVChange = (event) => {
    const value = parseInt(event.target.value)

    if (!isNaN(value)) {
      setLanceBV(value);
    } else {
      setLanceBV(0);
    }

    return value;
  }

  const handleGunneryChange = (index, event, piloting) => {
    const value = parseInt(event.target.value);

    if (value < 0) {
      setGunnery(4);
      alert("Wartość nie może być mniejsza niż 0")
    } else if (value > 8) {
      setGunnery(4);
      alert("Wartość nie może być większa niż 8")
    } else (

      setTableData(prevTableData => {
        const updatedData = [...prevTableData];
        updatedData[index].gunnery = value;
        setGunnery(value);
        setPiloting(piloting);
        valueBVCalculation(Piloting, value, index);
        return updatedData;
      }));
  };

  const handlePilotingChange = (index, event, gunnery) => {
    const value = parseInt(event.target.value);

    if (value < 0) {
      setPiloting(5);
      alert("Wartość nie może być mniejsza niż 0")
    } else if (value > 8) {
      setPiloting(5);
      alert("Wartość nie może być większa niż 8")
    } else (

      setTableData(prevTableData => {
        const updatedData = [...prevTableData];
        updatedData[index].piloting = value;
        setPiloting(value);
        setGunnery(gunnery);
        valueBVCalculation(value, Gunnery, index);
        return updatedData;
      }));
  };

  function getThirdArrayValue(x, y) {
    const index = y * FirstArray.length + x;
    return ThirdArray[index];
  }


  function valueBVCalculation(pilotingValue, gunneryValue, index) {

    const percent = getThirdArrayValue(pilotingValue, gunneryValue);

    setTableData(prevTableData => {
      const updatedData = [...prevTableData];
      const calculation = updatedData[index].BV * percent;

      updatedData[index].calculated_BV = Math.round(calculation);

      return updatedData;
    });
  }

  const saveTable = () => {
    localStorage.setItem('userData', JSON.stringify(selectedRows));
    localStorage.setItem('userBV', JSON.stringify(lanceBV));
    console.log(selectedRows, lanceBV);
  };

  const loadSavedData = () => {
    const savedData = JSON.parse(localStorage.getItem('userData')) || [];
    const savedBV = JSON.parse(localStorage.getItem('userBV'));
    setSelectedRow(savedData);
    setLanceBV(savedBV);
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  const convertToPDF = async () => {
    const table = tableRef.current;
    const pdf = new jsPDF('p', 'pt', 'letter');

    const tableHeight = table.clientHeight;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const numPages = Math.ceil(tableHeight / pageHeight);

    for (let page = 0; page < numPages; page++) {
      const yPosition = -page * pageHeight;
      const canvas = await html2canvas(table, { windowHeight: tableHeight });

      if (page > 0) {
        pdf.addPage();
      }

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, yPosition, pdf.internal.pageSize.getWidth(), tableHeight);
    }

    pdf.save('table.pdf');
  };


  return (
    <div className="App">
      <div className='bg-img'><img src={mech} /></div>

      <Filters
        initialData={initialData}
        setTableData={setTableData}
      />

      <PercentTable
        Piloting={Piloting}
        Gunnery={Gunnery}
        getThirdArrayValue={getThirdArrayValue}
      />


      <div className='userBV-input'> <label for="userBVLance-input">Lance BV</label> <input id='userBVLance-input' value={lanceBV} onChange={(event) => handleLanceBVChange(event)}></input></div>
      <div className='col-6'><button type="button" class="btn btn-success mb-3" onClick={saveTable}>Save</button></div>
      <div className='col-6'><button class="btn btn-success mb-3" onClick={convertToPDF}>Convert to PDF</button></div>

      <div className='battle-tables'>
        <div className='mech-table'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Rules</th>
                <th>Tons</th>
                <th>BV</th>
                <th>Calculated BV</th>
                <th>Gunnery</th>
                <th>Piloting</th>
                <th>ADD</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) =>
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>{row.rules}</td>
                  <td>{row.tons}</td>
                  <td>{row.BV}</td>
                  <td>{row.calculated_BV}</td>
                  <td><input type='number' min={0} max={8} value={row.gunnery} onChange={(event) => handleGunneryChange(index, event, row.piloting)} /></td>
                  <td><input type='number' min={0} max={8} value={row.piloting} onChange={(event) => handlePilotingChange(index, event, row.gunnery)} /></td>
                  <td><button onClick={() => addToLance(row, lanceBV, row.calculated_BV)}>Add to lance</button></td>
                </tr>)}
            </tbody>
          </table>
        </div>

        <div className='user-table'>
          <table ref={tableRef}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Rules</th>
                <th>Tons</th>
                <th>BV</th>
                <th>Calculated BV</th>
                <th>Gunnery</th>
                <th>Piloting</th>
              </tr>
            </thead>
            <tbody>
              {selectedRows.map((row, index) =>
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>{row.rules}</td>
                  <td>{row.tons}</td>
                  <td>{row.BV}</td>
                  <td>{row.calculated_BV}</td>
                  <td>{row.gunnery}</td>
                  <td>{row.piloting}</td>
                  <td><button onClick={() => cutFromLance(row, lanceBV, row.calculated_BV)}>Delete</button></td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default App;