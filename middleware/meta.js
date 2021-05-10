export default function({ route, store }) {
  store.commit("setMeta", route.meta[0]);
}
