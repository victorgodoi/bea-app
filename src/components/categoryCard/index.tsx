import { Category } from '@/src/types/categories.types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import {
  Card,
  CardBadge,
  CardBadgeText,
  CardHeader,
  CardInfo,
  CardInfoLabel,
  CardInfoRow,
  CardInfoText,
  CardTitle,
  SubCategoriesContainer,
  SubCategoryChip,
  SubCategoryText,
} from './styleCategoryCard';

interface CategoryCardProps extends TouchableOpacityProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  ...rest 
}) => {
  const subCategoriesCount = category.sub_categories?.length || 0;
  const hasSubCategories = subCategoriesCount > 0;

  return (
    <Card {...rest}>
      <CardHeader>
        <CardTitle numberOfLines={1}>{category.name}</CardTitle>
        <CardBadge hasSubCategories={hasSubCategories}>
          <CardBadgeText hasSubCategories={hasSubCategories}>
            {subCategoriesCount} {subCategoriesCount === 1 ? 'subcategoria' : 'subcategorias'}
          </CardBadgeText>
        </CardBadge>
      </CardHeader>

      <CardInfo>
        <CardInfoRow>
          <MaterialCommunityIcons name="text-box-outline" size={20} color="#666" />
          <CardInfoLabel>Descrição:</CardInfoLabel>
          <CardInfoText numberOfLines={2}>{category.description}</CardInfoText>
        </CardInfoRow>
      </CardInfo>

      {hasSubCategories && (
        <SubCategoriesContainer>
          {category.sub_categories?.slice(0, 6).map((sub) => (
            <SubCategoryChip key={sub.id}>
              <SubCategoryText numberOfLines={1}>{sub.name}</SubCategoryText>
            </SubCategoryChip>
          ))}
          {subCategoriesCount > 6 && (
            <SubCategoryChip>
              <SubCategoryText>+{subCategoriesCount - 6}</SubCategoryText>
            </SubCategoryChip>
          )}
        </SubCategoriesContainer>
      )}
    </Card>
  );
};
