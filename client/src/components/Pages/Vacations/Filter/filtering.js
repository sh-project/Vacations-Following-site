const filtering = (filter, sortBy, vacations) => {
    let actualVacations = [...vacations];

    switch (sortBy) {
        case 'destination':
            const compare = (a, b) => {
                if (a.destination < b.destination) {
                    return -1;
                }
                if (a.destination > b.destination) {
                    return 1;
                }
                return 0;
            }
            actualVacations = actualVacations.sort(compare);
            break

        case "data":
            const compareData = (a, b) => {
                if (a.date_from > b.date_from) {
                    return -1;
                }
                if (a.date_from < b.date_from) {
                    return 1;
                }
                return 0;
            }
            actualVacations = actualVacations.sort(compareData);
            break

        case "price":
            actualVacations = actualVacations.sort((a, b) => {
                return a.price - b.price;
            });
            break

        case "userfollow":
            actualVacations = actualVacations.sort((b, a) => {
                return a.userfollow - b.userfollow;
            });
            break

        case "followers":
            actualVacations = actualVacations.sort((b, a) => {
                return a.followers - b.followers;
            });
            break

        default:
            break
    }

    if (filter) {
        actualVacations = actualVacations.filter(vaca => vaca.userfollow);
    }

    return actualVacations;
}


module.exports = { filtering };