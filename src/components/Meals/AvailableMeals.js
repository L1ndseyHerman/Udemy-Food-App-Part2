import { useEffect, useState } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {

  const [meals, setMeals] = useState([]);

  useEffect( () => {
    //  Need this extra function bec the useEffect itself isn't allowed to be async.
    const fetchMeals = async () => {
      const response = await fetch('https://udemy-meals-data-foodapp-default-rtdb.firebaseio.com/meals.json');
      const responseData = await response.json();
      //  Gets a JSON object (not array) from Firebase, where like the 'm1', 'm2', etc are keys.
      //  Then the values are nested objects with properties, like {name: Sushi, price: ...}.

      //  Turning the JSON data into an array.
      const loadedMeals = [];

      for (const key in responseData){
        loadedMeals.push({
          id: key,
          //  This is 2 properties deep, like looking for 'm1', then 'Sushi'.
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price
        });
      }

      setMeals(loadedMeals);
    };

    fetchMeals();
  }, []);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
