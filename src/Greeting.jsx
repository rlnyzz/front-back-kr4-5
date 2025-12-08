function Greeting() {
 const userName = 'Виталий'; 

 const currentHour = new Date().getHours();
 let timeOfDay;
 if (currentHour < 12) {
 timeOfDay = 'Доброе утро';
 } else if (currentHour < 17) {
 timeOfDay = 'Добрый день';
 } else {
 timeOfDay = 'Добрый вечер';
 }
 return (
 <div className="greeting">
 {/* вставляем динамическое приветствие и имя */}
 <h1>{timeOfDay}, {userName}!</h1>
 <p>Рады видеть вас в нашем приложении.</p>
 </div>
 );
}
export default Greeting;
