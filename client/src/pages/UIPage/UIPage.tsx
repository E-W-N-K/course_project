import {
	UIButton,
	UIContainer,
	UISection,
	UIFlex,
	UIMain,
	UIInput,
	UIForm,
	UICard,
	UIGrid,
} from "../../shared/ui";

export const UIPage = () => {
	return (
		<UIMain>
			<UISection variant="secondary">
				<UIContainer>
					<h1 className="heading heading--4xl">UI Components</h1>
				</UIContainer>
			</UISection>

			<UISection>
				<UIContainer>
					<h2 className="heading heading--3xl">Typography</h2>
					<UICard>
						<h1 className="heading heading--4xl">Heading 1</h1>
						<h2 className="heading heading--3xl">Heading 2</h2>
						<h3 className="heading heading--2xl">Heading 3</h3>
						<h4 className="heading heading--xl">Heading 4</h4>
						<h5 className="heading heading--lg">Heading 5</h5>
						<h6 className="heading heading--base">Heading 6</h6>
						<p className="text">
							This is a paragraph with regular text. It uses relaxed line-height
							for better readability. Paragraphs have automatic spacing below
							them for proper vertical rhythm.
						</p>
						<p className="text text--secondary">
							This is a paragraph with secondary text color, perfect for
							descriptions and supporting text.
						</p>
						<small className="text text--sm">
							This is small text, often used for captions or fine print.
						</small>
					</UICard>
				</UIContainer>
			</UISection>

			<UISection variant={"secondary"}>
				<UIContainer>
					<h2 className="heading heading--3xl">Buttons</h2>
					<UIFlex gap="lg" wrap>
						<UIButton variant="solid" colorType="primary">
							Primary Solid
						</UIButton>
						<UIButton variant="solid" colorType="secondary">
							Secondary Solid
						</UIButton>
						<UIButton variant="solid" colorType="danger">
							Danger Solid
						</UIButton>

						<UIButton variant="outline" colorType="primary">
							Primary Outline
						</UIButton>
						<UIButton variant="outline" colorType="secondary">
							Secondary Outline
						</UIButton>
						<UIButton variant="outline" colorType="danger">
							Danger Outline
						</UIButton>

						<UIButton variant="solid" colorType="primary" disabled>
							Disabled
						</UIButton>
					</UIFlex>
				</UIContainer>
			</UISection>

			<UISection>
				<UIContainer>
					<h2 className="heading heading--3xl">Inputs</h2>
					<UIFlex direction="column" gap="2xl">
						<UIInput type="text" label="Text Input" placeholder="Enter text" />

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
					<h2 className="heading heading--3xl">Input Validation</h2>
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
								pattern: /^\d{3}-\d{3}-\d{4}$/,
							}}
						/>

						<UIInput
							type="text"
							label="Custom Validation"
							placeholder="Enter 'valid' to pass"
							validate={(value) => {
								if (value !== "valid") {
									return 'You must enter "valid"';
								}
								return undefined;
							}}
						/>
					</UIFlex>
				</UIContainer>
			</UISection>

			<UISection>
				<UIContainer>
					<h2 className="heading heading--3xl">Form with Validation</h2>
					<p className="text">
						The submit button is disabled until all required fields are valid.
						Try filling out the form to enable it.
					</p>
					<UICard>
						<UIForm
							onSubmit={() => {
								console.log("Form submitted");
								alert(
									"Form submitted successfully! Check console for details.",
								);
							}}
							actions={(isValid) => (
								<>
									<UIButton
										variant="outline"
										colorType="secondary"
										type="button"
									>
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
					</UICard>
				</UIContainer>
			</UISection>

			<UISection variant="secondary">
				<UIContainer>
					<h2 className="heading heading--3xl">Cards</h2>
					<UIGrid columns={3} gap="lg">
						<UICard
							padding="lg"
							header={
								<h3 className="heading heading--2xl">
									Large Padding (Default)
								</h3>
							}
						>
							<p className="text text--secondary">
								This card uses large padding, which is the default.
							</p>
						</UICard>

						<UICard
							header={
								<h3 className="heading heading--2xl">Interactive Card</h3>
							}
							footer={
								<UIFlex gap="md">
									<UIButton variant="outline" colorType="secondary">
										Cancel
									</UIButton>
									<UIButton variant="solid" colorType="primary">
										Confirm
									</UIButton>
								</UIFlex>
							}
						>
							<p className="text text--secondary">
								Perfect for displaying information in organized blocks.
							</p>
						</UICard>

						<UICard>
							<p className="text">
								This card uses only the default children slot.
							</p>
						</UICard>

						<UICard
							padding="sm"
							header={<h4 className="heading heading--xl">Small Padding</h4>}
						>
							<p className="text text--secondary">
								You can control heading levels!
							</p>
						</UICard>

						<UICard
							padding="xl"
							header={
								<UIFlex align="center" justify="between">
									<h3 className="heading heading--2xl">Custom Header</h3>
									<span className="text text--sm text--secondary">Badge</span>
								</UIFlex>
							}
						>
							<p className="text text--secondary">
								Headers and footers accept any ReactNode!
							</p>
						</UICard>

						<UICard
							header={<h5 className="heading heading--lg">With Footer</h5>}
							footer={
								<small className="text text--sm text--secondary">
									Updated 2 hours ago
								</small>
							}
						>
							<p className="text">Both header and footer slots in action.</p>
						</UICard>
					</UIGrid>
				</UIContainer>
			</UISection>
		</UIMain>
	);
};
