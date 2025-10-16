import { UIButton, UIContainer, UISection, UIFlex } from '../../shared/ui'

export const UIPage = () => {
  return (
    <UIContainer>
      <h1>UI Components</h1>

      <UISection title="Buttons">
        <UIFlex gap="lg" wrap>
          <UIButton variant="solid" colorType="primary">Primary Solid</UIButton>
          <UIButton variant="solid" colorType="secondary">Secondary Solid</UIButton>
          <UIButton variant="solid" colorType="danger">Danger Solid</UIButton>

          <UIButton variant="outline" colorType="primary">Primary Outline</UIButton>
          <UIButton variant="outline" colorType="secondary">Secondary Outline</UIButton>
          <UIButton variant="outline" colorType="danger">Danger Outline</UIButton>

          <UIButton variant="solid" colorType="primary" disabled>Disabled</UIButton>
        </UIFlex>
      </UISection>
    </UIContainer>
  )
}