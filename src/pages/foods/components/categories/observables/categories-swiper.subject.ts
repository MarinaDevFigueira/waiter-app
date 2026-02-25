import { BehaviorSubject, type Subscription } from "rxjs";

interface CategoriesSwiperState {
  isBeginning: boolean;
  isEnd: boolean;
}

const initialState: CategoriesSwiperState = {
  isBeginning: true,
  isEnd: false,
};

const categoriesSwiperSubject = new BehaviorSubject<CategoriesSwiperState>(initialState);

export const categoriesSwiperObservable = {
  subscribe: (callback: (value: CategoriesSwiperState) => void): Subscription =>
    categoriesSwiperSubject.subscribe(callback),
  getValue: (): CategoriesSwiperState => categoriesSwiperSubject.getValue(),
  updateState: (newState: Partial<CategoriesSwiperState>): void => {
    const currentState = categoriesSwiperSubject.getValue();
    categoriesSwiperSubject.next({ ...currentState, ...newState });
  },
  resetState: (): void => {
    categoriesSwiperSubject.next(initialState);
  },
};

export type { CategoriesSwiperState };
