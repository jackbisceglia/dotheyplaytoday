type SuccessProps = {
  readonly hidden: boolean;
  readonly titleRef: (element: HTMLHeadingElement) => void;
};

export function Success(props: SuccessProps) {
  return (
    <div
      class="signup-success"
      hidden={props.hidden}
      role="status"
      aria-atomic="true"
    >
      <p class="signup-success-mark" aria-hidden="true">
        ✓
      </p>
      <h3 class="signup-success-title" tabindex="-1" ref={props.titleRef}>
        Check your email to start your updates.
      </h3>
      <p class="signup-success-copy">
        Follow the confirmation link to verify your email. Your teams and
        schedule are saved.
      </p>
    </div>
  );
}
