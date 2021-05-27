export default function(members, id, lastOnline) {
  members.forEach(user => {
    if (user._id === id) {
      user["is-online"] = false;
      user["last-online"] = lastOnline;
    }
  });
}
