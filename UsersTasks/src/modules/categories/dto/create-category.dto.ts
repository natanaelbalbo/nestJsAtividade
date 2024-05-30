import { CategoriesColors } from "../../../shared/utils/enums/categorie-colors.enum";

export class CreateCategoryDto {
    name: string;
    color: CategoriesColors;
}