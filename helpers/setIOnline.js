export default function(members, id) {
  members.forEach(user => {
    if (user._id === id) {
      user["is-online"] = true;
    }
  });
}
