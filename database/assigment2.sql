/*Task 1 
ERICK ORELLANA
BYU Idaho CSE 340 Web Backend Development
*/

--QUERY 1
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n')

--QUERY 2
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony'

--QUERY 3
DELETE FROM public.account
WHERE account_firstname = 'Tony'

--QUERY 4
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = 10

--QUERY 5
SELECT
T1.inv_make AS MAKE,
T1.inv_model AS MODEL,
T2.classification_name AS CLASSIFICATION
FROM public.inventory T1
INNER JOIN public.classification T2
	ON T1.classification_id = T2.classification_id
WHERE classification_name = 'Sport'

--QUERY 6
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_image, '/images/', '/images/vehicles/')

--QUERY 7
