import React from 'react';

function PercentTable({ Piloting, Gunnery, getThirdArrayValue }) {
  const FirstArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const SecondArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className='percent-table'>
      <table>
        <thead>
          <tr>
            <th></th>
            {FirstArray.map((num) => (
              <th key={num}>{num}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SecondArray.map((num1) => (
            <tr key={num1}>
              <td style={{ fontWeight: 'bold' }}>{num1}</td>
              {FirstArray.map((num2) => (
                <td key={`${num1}-${num2}`} style={{ backgroundColor: Piloting === num2 && Gunnery === num1 ? 'yellow' : 'transparent' }}>{getThirdArrayValue(num2, num1)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PercentTable;