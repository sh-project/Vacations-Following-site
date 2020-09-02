import React from 'react';

const VacationsContext = React.createContext({
    vacations: [],
    setVacations: () => { }
})

export default VacationsContext