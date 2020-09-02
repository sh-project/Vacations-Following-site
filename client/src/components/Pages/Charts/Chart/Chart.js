import React, { useContext, useEffect, useState } from 'react';
import VacationsContext from '../../../../context/VacationsContext';
import ErrorMsgContext from '../../../../context/ErrorMsgContext';
import useResponsive from '../../../../hooks/useResponsive'
import { Bar } from 'react-chartjs-2';

//responsive
function Chart() {
  const { vacations, setVacations } = useContext(VacationsContext);
  const { setErrorMsg } = useContext(ErrorMsgContext);
  const [filteredVacations, setFilteredVacations] = useState([]);
  const contentWidth = useResponsive();

  const renderData = () => {
    let labels, followers = [];
    if (vacations.length){
      labels = filteredVacations.map(vacation => {
        return vacation.destination;
      })

      followers = filteredVacations.map(vacation => {
        return vacation.followers;
      })
    }

      const data = {
        labels: labels,
        datasets: [
          {
            label: 'followers',
            backgroundColor: '#fabf53',
            borderColor: '#e19b15',
            borderWidth: 2,
            hoverBackgroundColor: '#faac17',
            hoverBorderColor: '#fabf53',
            data: followers
          }
        ]
      };
      return data;
  }

  const getVacations = async () => {
    try {
      const res = await fetch('/vacations', {
        credentials: 'include'
      });
      const { success, msg } = await res.json();
      if (!success) {
        setErrorMsg({ error: true, msg: msg });
      }
      else {
        setVacations(msg);
        const filterVacations = msg.filter(vacation => {
          return vacation.followers > 0;
        })
        setFilteredVacations(filterVacations);
      }
    } catch {
      setErrorMsg({ error: true, msg: 'There may be problems connecting. We\'re fixing it.' });
    }
  }

  useEffect(() => {
    getVacations();
    // eslint-disable-next-line
  }, [])

  return (
    <div>
      {(!vacations || !filteredVacations.length > 0 ) && <div className="load-vacation">
            <h2>the followers are probably on way...</h2>
        </div>}
      {(vacations && filteredVacations.length > 0 ) && <Bar
        data={renderData}
        width={contentWidth}
        height={400}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
                stacked: false
            }],
            yAxes: [{
                stacked: true
            }]
        }
        }}
      />}
    </div>
  );
};

export default Chart;