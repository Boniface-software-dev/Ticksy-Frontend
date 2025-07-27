// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';

// function Events() {
//   const { id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/events/${id}`);

//         setEvent(res.data);
//         setLoading(false);
//       } catch (err) {
//         setError("Event not found.");
//         setLoading(false);
//       }
//     };

//     fetchEvent();
//   }, [id]);

//   if (loading) return <p className="text-center text-lg mt-10">Loading...</p>;
//   if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
//       <h2 className="text-3xl font-bold mb-4 text-gray-800">{event.title}</h2>

//       <img
//         src={event.image_url}
//         alt={event.title}
//         className="w-full h-auto rounded-lg mb-6 shadow"
//       />

//       <p className="text-gray-700 mb-4">{event.description}</p>

//       <div className="space-y-2 text-gray-600">
//         <p><span className="font-semibold text-gray-800">Location:</span> {event.location}</p>
//         <p><span className="font-semibold text-gray-800">Category:</span> {event.category}</p>
//         <p><span className="font-semibold text-gray-800">Tags:</span> {event.tags}</p>
//         <p><span className="font-semibold text-gray-800">Start:</span> {new Date(event.start_time).toLocaleString()}</p>
//         <p><span className="font-semibold text-gray-800">End:</span> {new Date(event.end_time).toLocaleString()}</p>
//         <p>
//           <span className="font-semibold text-gray-800">Organizer:</span>{" "}
//           {event["organizer.first_name"]} {event["organizer.last_name"]}
//         </p>
//       </div>

//       <div className="mt-8">
//         <h3 className="text-2xl font-semibold mb-3 text-purple-600">Tickets</h3>

//         {event.tickets && event.tickets.length > 0 ? (
//           <ul className="space-y-2">
//             {event.tickets.map((ticket) => (
//               <li key={ticket.id} className="p-3 bg-gray-100 rounded-lg shadow-sm text-black">
//                 <span className="font-medium">{ticket.type}</span> — ${ticket.price.toFixed(2)}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No tickets available.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Events;
