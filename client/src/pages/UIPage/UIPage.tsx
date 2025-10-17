import { UIButton, UIContainer, UISection, UIFlex, UIMain, UIInput } from '../../shared/ui'

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

			<UISection>
				<UIContainer>
					<h2>Inputs</h2>
					<UIFlex direction="column" gap="xl">
						<UIInput
							type="text"
							label="Text Input"
							placeholder="Enter text"
						/>

						<UIInput
							type="email"
							label="Email Input"
							placeholder="Enter your email"
						/>

						<UIInput
							type="password"
							label="Password Input"
							placeholder="Enter password"
						/>

						<UIInput
							type="text"
							label="Input with Error"
							placeholder="This field has an error"
							error="This field is required"
						/>

						<UIInput
							type="text"
							label="Disabled Input"
							placeholder="Cannot edit this"
							disabled
							value="Disabled value"
						/>
					</UIFlex>
				</UIContainer>
			</UISection>
		</UIMain>
	)
}