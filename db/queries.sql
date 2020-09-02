SELECT v.destination, v.slogan, v.image,
		v.description,
		DATE_FORMAT(v.date_from, "%d/%m/%Y") AS date_from,
        DATE_FORMAT(v.date_to, "%d/%m/%Y") AS date_to,
        v.price,
        count(f.user) as followers,
        fu.user as userfollow
FROM jbh_travel.vacations AS v
LEFT JOIN jbh_travel.follow AS f ON (v.id = f.vacation)
LEFT JOIN jbh_travel.follow AS fu ON (v.id = fu.vacation) and fu.user = 22
GROUP BY v.id
ORDER BY userfollow DESC, v.id;

DELETE FROM jbh_travel.follow
WHERE vacation = 5 AND user = 6;