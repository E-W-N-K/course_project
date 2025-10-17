import { UIButton, UIContainer, UISection, UIFlex, UIMain } from '../../shared/ui'

export const UIPage = () => {
	return (
		<UIMain>
			<UISection>
				<UIContainer>
					<h1>UI Components</h1>
				</UIContainer>
			</UISection>
			<UISection variant={"secondary"}>
				<UIContainer>
					<h2>Buttons</h2>
					<UIFlex gap="lg" wrap>
						<UIButton variant="solid" colorType="primary">Primary Solid</UIButton>
						<UIButton variant="solid" colorType="secondary">Secondary Solid</UIButton>
						<UIButton variant="solid" colorType="danger">Danger Solid</UIButton>

						<UIButton variant="outline" colorType="primary">Primary Outline</UIButton>
						<UIButton variant="outline" colorType="secondary">Secondary Outline</UIButton>
						<UIButton variant="outline" colorType="danger">Danger Outline</UIButton>

						<UIButton variant="solid" colorType="primary" disabled>Disabled</UIButton>
					</UIFlex>
				</UIContainer>
			</UISection>
		</UIMain>
	)
}