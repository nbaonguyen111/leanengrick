export interface Group {
  id: string;
  name: string;
  icon: string;
  nameEn: string;
}

export interface Phrase {
  id: number;
  group_id: string;
  english_text: string;
  vietnamese_text: string;
  keywords: string[];
  /** Tên người tạo (chỉ có ở custom phrases) */
  author?: string;
  /** ID của custom group con (ví dụ "chao-hoi", "goi-mon") */
  custom_group_id?: string;
}

export interface PhraseData {
  groups: Group[];
  phrases: Phrase[];
}

/** Group con do người dùng tự tạo */
export interface CustomGroup {
  id: string;
  name: string;
  /** ID của category cha (restaurant, hotel, ...) */
  parent_group_id: string;
  /** Tên người tạo */
  author: string;
}

/** Thông tin người dùng */
export interface UserProfile {
  name: string;
}