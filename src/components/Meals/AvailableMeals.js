import { useEffect, useState } from 'react';

import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';

const AvailableMeals = () => {

  const [meals, setMeals] = useState([]);
  //  Since always loads when the component loads for the first time, ok to set to true here.
  const [isLoading, setIsLoading] = useState(true);
  //  No default value means the useState() starts as undefined.
  const [httpError, setHttpError] = useState();

  useEffect( () => {
    //  Need this extra function bec the useEffect itself isn't allowed to be async.
    const fetchMeals = async () => {
      const response = await fetch('https://udemy-meals-data-foodapp-default-rtdb.firebaseio.com/meals.json');
      //  For testing error code:
      //const response = await fetch('https://udemy-meals-data-foodapp-default-rtdb.firebaseio.com/meals');

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

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
      setIsLoading(false);
    };

    //  Normally, put fetchMeals() in try/catch, but bec it's async, have to do this weird thing.
    //  Something about the Promise rejects bec the error, so put .catch() here?!
    fetchMeals().catch(error => {
      setIsLoading(false);
      //  Sets is to 'Something went wrong!'
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
    <section className={classes.MealsLoading}>
      <p>Loading...</p>
    </section>
    );
  }

  if (httpError) {
    return (
    <section className={classes.MealsError}>
      <p>{httpError}</p>
      </section>
    );
  }

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
