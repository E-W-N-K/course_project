import { UIButton, UIContainer, UISection, UIFlex, UIMain, UIInput, UIForm } from '../../shared/ui'

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
					<UIFlex direction="column" gap="2xl">
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
							label="Disabled Input"
							placeholder="Cannot edit this"
							disabled
							value="Disabled value"
						/>
					</UIFlex>
				</UIContainer>
			</UISection>

			<UISection variant="secondary">
				<UIContainer>
					<h2>Input Validation</h2>
					<UIFlex direction="column" gap="2xl">
						<UIInput
							type="text"
							label="Required Field"
							placeholder="This field is required"
							validation={{ required: true }}
						/>

						<UIInput
							type="email"
							label="Email Validation"
							placeholder="Enter a valid email"
							validation={{ required: true, email: true }}
						/>

						<UIInput
							type="password"
							label="Password (min 8 characters)"
							placeholder="Enter password"
							validation={{ required: true, minLength: 8 }}
						/>

						<UIInput
							type="text"
							label="Username (3-20 characters)"
							placeholder="Enter username"
							validation={{ required: true, minLength: 3, maxLength: 20 }}
						/>

						<UIInput
							type="text"
							label="Phone Number (Pattern)"
							placeholder="Enter phone (e.g., 123-456-7890)"
							validation={{
								required: true,
								pattern: /^\d{3}-\d{3}-\d{4}$/
							}}
						/>

						<UIInput
							type="text"
							label="Custom Validation"
							placeholder="Enter 'valid' to pass"
							validate={(value) => {
								if (value !== 'valid') {
									return 'You must enter "valid"'
								}
								return undefined
							}}
						/>
					</UIFlex>
				</UIContainer>
			</UISection>

			<UISection>
				<UIContainer>
					<h2>Form with Validation</h2>
					<p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-text-secondary)' }}>
						The submit button is disabled until all required fields are valid. Try filling out the form to enable it.
					</p>
					<UIForm
						onSubmit={() => {
							console.log('Form submitted')
							alert('Form submitted successfully! Check console for details.')
						}}
						actions={(isValid) => (
							<>
								<UIButton variant="outline" colorType="secondary" type="button">
									Cancel
								</UIButton>
								<UIButton
									variant="solid"
									colorType="primary"
									type="submit"
									disabled={!isValid}
								>
									Submit
								</UIButton>
							</>
						)}
					>
						<UIInput
							type="text"
							label="Full Name"
							placeholder="Enter your full name"
							validation={{ required: true }}
						/>

						<UIInput
							type="email"
							label="Email Address"
							placeholder="Enter your email"
							validation={{ required: true, email: true }}
						/>

						<UIInput
							type="password"
							label="Password"
							placeholder="Enter password"
							validation={{ required: true, minLength: 8 }}
						/>
					</UIForm>
				</UIContainer>
			</UISection>
		</UIMain>
	)
}