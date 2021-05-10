export const state = () => ({
  meta: null
});

export const mutations = {
  setMeta(state, payload) {
    state.meta = payload;
  }
};
