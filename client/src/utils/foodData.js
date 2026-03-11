const foodDatabase = [
    { name: 'Eggs', calories: 155, protein: 13 },
    { name: 'Chicken Breast', calories: 165, protein: 31 },
    { name: 'Chicken Thigh', calories: 209, protein: 26 },
    { name: 'Salmon', calories: 208, protein: 20 },
    { name: 'Tuna', calories: 132, protein: 28 },
    { name: 'Beef Steak', calories: 271, protein: 26 },
    { name: 'Ground Beef', calories: 254, protein: 26 },
    { name: 'Lamb', calories: 294, protein: 25 },
    { name: 'Pork Chop', calories: 231, protein: 25 },
    { name: 'Shrimp', calories: 99, protein: 24 },
    { name: 'Tofu', calories: 76, protein: 8 },
    { name: 'Paneer', calories: 265, protein: 18 },
    { name: 'Greek Yogurt', calories: 59, protein: 10 },
    { name: 'Cottage Cheese', calories: 98, protein: 11 },
    { name: 'Milk', calories: 61, protein: 3 },
    { name: 'Cheddar Cheese', calories: 402, protein: 25 },
    { name: 'White Rice', calories: 130, protein: 3 },
    { name: 'Brown Rice', calories: 123, protein: 3 },
    { name: 'Oats', calories: 389, protein: 17 },
    { name: 'Bread', calories: 265, protein: 9 },
    { name: 'Whole Wheat Bread', calories: 247, protein: 13 },
    { name: 'Pasta', calories: 131, protein: 5 },
    { name: 'Sweet Potato', calories: 86, protein: 2 },
    { name: 'Potato', calories: 77, protein: 2 },
    { name: 'Banana', calories: 89, protein: 1 },
    { name: 'Apple', calories: 52, protein: 0.3 },
    { name: 'Orange', calories: 47, protein: 0.9 },
    { name: 'Mango', calories: 60, protein: 0.8 },
    { name: 'Strawberries', calories: 32, protein: 0.7 },
    { name: 'Blueberries', calories: 57, protein: 0.7 },
    { name: 'Avocado', calories: 160, protein: 2 },
    { name: 'Broccoli', calories: 34, protein: 2.8 },
    { name: 'Spinach', calories: 23, protein: 2.9 },
    { name: 'Carrot', calories: 41, protein: 0.9 },
    { name: 'Tomato', calories: 18, protein: 0.9 },
    { name: 'Cucumber', calories: 16, protein: 0.7 },
    { name: 'Lettuce', calories: 15, protein: 1.4 },
    { name: 'Lentils', calories: 116, protein: 9 },
    { name: 'Chickpeas', calories: 164, protein: 9 },
    { name: 'Black Beans', calories: 132, protein: 9 },
    { name: 'Peanut Butter', calories: 588, protein: 25 },
    { name: 'Almonds', calories: 579, protein: 21 },
    { name: 'Walnuts', calories: 654, protein: 15 },
    { name: 'Cashews', calories: 553, protein: 18 },
    { name: 'Olive Oil', calories: 884, protein: 0 },
    { name: 'Butter', calories: 717, protein: 0.9 },
    { name: 'Pizza', calories: 266, protein: 11 },
    { name: 'Burger', calories: 295, protein: 17 },
    { name: 'French Fries', calories: 312, protein: 3.4 },
    { name: 'Salad', calories: 20, protein: 1.5 },
    { name: 'Sandwich', calories: 250, protein: 12 },
    { name: 'Soup', calories: 55, protein: 3 },
    { name: 'Idli', calories: 39, protein: 2 },
    { name: 'Dosa', calories: 168, protein: 4 },
    { name: 'Dal', calories: 116, protein: 9 },
    { name: 'Chapati', calories: 297, protein: 9 },
    { name: 'Biryani', calories: 290, protein: 12 },
    { name: 'Samosa', calories: 308, protein: 6 },
    { name: 'Coffee', calories: 2, protein: 0.3 },
    { name: 'Tea', calories: 1, protein: 0 },
    { name: 'Orange Juice', calories: 45, protein: 0.7 },
    { name: 'Protein Shake', calories: 120, protein: 25 },
    { name: 'Whey Protein', calories: 120, protein: 25 },
    { name: 'Energy Bar', calories: 400, protein: 10 },
];


export function searchFood(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase().trim();
    return foodDatabase.filter(f => f.name.toLowerCase().includes(q)).slice(0, 6);
}

export function getFoodByName(name) {
    return foodDatabase.find(f => f.name.toLowerCase() === name.toLowerCase()) || null;
}

export default foodDatabase;
