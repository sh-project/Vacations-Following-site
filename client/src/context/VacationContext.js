import React from 'react';

const VacationContext = React.createContext({
    vacation: {},
    setVacation: () => { }
})

export default VacationContext