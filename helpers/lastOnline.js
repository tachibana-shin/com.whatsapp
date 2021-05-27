export default function lastOnline(members) {
  return Math.max(
    ...members.map(item => new Date(item["last-online"]).getTime())
  );
}
