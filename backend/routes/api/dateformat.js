module.exports = {
    dateFormat: function(date) {
       const yyyy = date.getFullYear();
       const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero indexed, so +1
       const dd = String(date.getDate()).padStart(2, '0');
       const hh = String(date.getHours()).padStart(2, '0');
       const min = String(date.getMinutes()).padStart(2, '0');
       const ss = String(date.getSeconds()).padStart(2, '0');
   
       return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
   },
   bookingDateFormat: function(date){
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero indexed, so +1
        const dd = String(date.getUTCDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`
   }
}